import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFiles,
    BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'previews', maxCount: 10 },
            { name: 'asset', maxCount: 1 },
        ]),
    )
    create(
        @Body() createProductDto: CreateProductDto,
        @UploadedFiles()
        files: {
            previews?: Express.Multer.File[];
            asset?: Express.Multer.File[];
        },
    ) {
        if (!files || !files.asset || files.asset.length === 0) {
            throw new BadRequestException('Asset file is required');
        }

        const previewFiles = files.previews || [];
        const assetFile = files.asset[0];

        return this.productService.create(createProductDto, previewFiles, assetFile);
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
        return this.productService.findByUser(userId);
    }

    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(id);
    }

    @Patch(':id')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'previews', maxCount: 10 },
            { name: 'asset', maxCount: 1 },
        ]),
    )
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFiles()
        files: {
            previews?: Express.Multer.File[];
            asset?: Express.Multer.File[];
        },
    ) {
        const previewFiles = files?.previews || [];
        const assetFile = files?.asset?.[0];
        return this.productService.update(id, updateProductDto, previewFiles, assetFile);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }
}
