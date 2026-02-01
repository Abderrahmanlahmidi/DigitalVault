import { IsString, IsUUID, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString() 
    price: string;

    @IsUUID()
    categoryId: string;

    @IsString() 
    @IsNotEmpty()
    userId: string;

    @IsEnum(Status)
    @IsOptional()
    status?: Status;
}