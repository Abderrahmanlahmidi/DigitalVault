import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductService {
    private s3Client: S3Client;
    private bucketName = process.env.S3_BUCKET_NAME_PROFILE || 'digital-vault-profile-pics';

    constructor(private prisma: PrismaService) {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });
    }

    async create(
        createProductDto: CreateProductDto,
        previewFiles: Express.Multer.File[],
        assetFile: Express.Multer.File,
    ) {
        try {
            // 1. Upload Previews
            const previewUrls = await Promise.all(
                previewFiles.map(async (file) => {
                    const extension = file.originalname.split('.').pop();
                    const key = `products/previews/${uuidv4()}.${extension}`;

                    await this.s3Client.send(
                        new PutObjectCommand({
                            Bucket: this.bucketName,
                            Key: key,
                            Body: file.buffer,
                            ContentType: file.mimetype,
                            ACL: 'public-read', // Previews usually public
                        }),
                    );

                    return `https://${this.bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
                }),
            );

            // 2. Upload Private Asset File
            const assetExtension = assetFile.originalname.split('.').pop();
            const privateFileKey = `products/files/${uuidv4()}.${assetExtension}`;

            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: privateFileKey,
                    Body: assetFile.buffer,
                    ContentType: assetFile.mimetype,
                }),
            );

            // 3. Save to Database
            return this.prisma.product.create({
                data: {
                    title: createProductDto.title,
                    description: createProductDto.description,
                    price: createProductDto.price,
                    status: createProductDto.status || 'PENDING',
                    categoryId: createProductDto.categoryId,
                    userId: createProductDto.userId,
                    previewUrls: previewUrls,
                    privateFileKey: privateFileKey,
                },
            });
        } catch (error) {
            console.error('Error creating product:', error);
            throw new InternalServerErrorException('Failed to create product and upload files');
        }
    }

    async findByUser(userId: string) {
        return this.prisma.product.findMany({
            where: { userId },
            include: {
                category: true,
            },
            orderBy: {
                title: 'asc',
            },
        });
    }

    async findAll() {
        return this.prisma.product.findMany({
            include: {
                category: true,
                user: true,
            },
        });
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                user: true,
            },
        });
        if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
        return product;
    }

    async update(
        id: string,
        updateProductDto: UpdateProductDto,
        previewFiles?: Express.Multer.File[],
        assetFile?: Express.Multer.File,
    ) {
        const product = await this.findOne(id);
        const updateData: any = { ...updateProductDto };

        try {
            // 1. If new previews are provided
            if (previewFiles && previewFiles.length > 0) {
                // Optional: Delete old previews from S3
                await Promise.all(
                    product.previewUrls.map(async (url) => {
                        const key = url.split('.com/').pop();
                        if (key) {
                            await this.s3Client.send(
                                new DeleteObjectCommand({
                                    Bucket: this.bucketName,
                                    Key: key,
                                }),
                            );
                        }
                    }),
                );

                // Upload new ones
                const previewUrls = await Promise.all(
                    previewFiles.map(async (file) => {
                        const extension = file.originalname.split('.').pop();
                        const key = `products/previews/${uuidv4()}.${extension}`;

                        await this.s3Client.send(
                            new PutObjectCommand({
                                Bucket: this.bucketName,
                                Key: key,
                                Body: file.buffer,
                                ContentType: file.mimetype,
                                ACL: 'public-read',
                            }),
                        );

                        return `https://${this.bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
                    }),
                );
                updateData.previewUrls = previewUrls;
            }

            // 2. If a new asset is provided
            if (assetFile) {
                // Delete old asset from S3
                await this.s3Client.send(
                    new DeleteObjectCommand({
                        Bucket: this.bucketName,
                        Key: product.privateFileKey,
                    }),
                );

                // Upload new one
                const assetExtension = assetFile.originalname.split('.').pop();
                const privateFileKey = `products/files/${uuidv4()}.${assetExtension}`;

                await this.s3Client.send(
                    new PutObjectCommand({
                        Bucket: this.bucketName,
                        Key: privateFileKey,
                        Body: assetFile.buffer,
                        ContentType: assetFile.mimetype,
                    }),
                );
                updateData.privateFileKey = privateFileKey;
            }

            return this.prisma.product.update({
                where: { id },
                data: updateData,
            });
        } catch (error) {
            console.error('Error updating product files:', error);
            throw new InternalServerErrorException('Failed to update product files');
        }
    }

    async remove(id: string) {
        const product = await this.findOne(id);

        // Delete files from S3
        try {
            // Delete Previews
            await Promise.all(
                product.previewUrls.map(async (url) => {
                    const key = url.split('.com/').pop();
                    if (key) {
                        await this.s3Client.send(
                            new DeleteObjectCommand({
                                Bucket: this.bucketName,
                                Key: key,
                            }),
                        );
                    }
                }),
            );

            // Delete Asset
            await this.s3Client.send(
                new DeleteObjectCommand({
                    Bucket: this.bucketName,
                    Key: product.privateFileKey,
                }),
            );
        } catch (error) {
            console.warn('Failed to delete S3 files during product removal:', error);
        }

        return this.prisma.product.delete({
            where: { id },
        });
    }
}
