import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
  AdminSetUserPasswordCommand,
  AttributeType,
} from '@aws-sdk/client-cognito-identity-provider';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class UserService {
  private cognitoClient: CognitoIdentityProviderClient;
  private s3Client: S3Client;
  private userPoolId = process.env.COGNITO_USER_POOL_ID || '';
  private bucketName =
    process.env.S3_BUCKET_NAME_PROFILE || 'digital-vault-profile-pics';

  constructor(private prisma: PrismaService) {
    const awsConfig = {
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    };
    this.cognitoClient = new CognitoIdentityProviderClient(awsConfig);
    this.s3Client = new S3Client(awsConfig);
  }

  async getProfile(userId: string) {
    console.log(`[UserService] getProfile called for userId: ${userId}`);
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { role: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.error(`[UserService] Error in getProfile:`, error);
      throw error;
    }
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const {
      firstName,
      lastName,
      phoneNumber,
      profileImageUrl,
      currentPassword,
      newPassword,
    } = updateUserDto;

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;

    if (profileImageUrl) updateData.profileImageUrl = profileImageUrl;

    console.log('profile image url from :', profileImageUrl);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const userAttributes: AttributeType[] = [];
    if (firstName)
      userAttributes.push({ Name: 'given_name', Value: firstName });
    if (lastName) userAttributes.push({ Name: 'family_name', Value: lastName });
    if (phoneNumber)
      userAttributes.push({ Name: 'phone_number', Value: phoneNumber });

    if (userAttributes.length > 0) {
      try {
        const command = new AdminUpdateUserAttributesCommand({
          UserPoolId: this.userPoolId,
          Username: userId,
          UserAttributes: userAttributes,
        });
        await this.cognitoClient.send(command);
      } catch (error) {
        console.error('Error updating Cognito attributes:', error);
        throw new InternalServerErrorException(
          `Cognito update failed: ${error.message}`,
        );
      }
    }

    if (newPassword) {
      if (currentPassword) {
        try {
          const command = new AdminSetUserPasswordCommand({
            UserPoolId: this.userPoolId,
            Username: userId,
            Password: newPassword,
            Permanent: true,
          });
          await this.cognitoClient.send(command);
        } catch (error) {
          console.error('Error updating password:', error);
          throw new InternalServerErrorException('Failed to update password');
        }
      }
    }

    return updatedUser;
  }

  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `profiles/${userId}-${Date.now()}.${fileExtension}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        }),
      );

      const imageUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

      return await this.prisma.user.update({
        where: { id: userId },
        data: { profileImageUrl: imageUrl },
      });
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new InternalServerErrorException('Failed to upload image to S3');
    }
  }
}
