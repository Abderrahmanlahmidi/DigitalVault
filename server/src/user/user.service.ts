import * as fs from 'fs';
import * as path from 'path';
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

@Injectable()
export class UserService {
  private cognitoClient: CognitoIdentityProviderClient;
  private userPoolId = process.env.COGNITO_USER_POOL_ID || '';

  constructor(private prisma: PrismaService) {
    const awsConfig = {
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    };
    this.cognitoClient = new CognitoIdentityProviderClient(awsConfig);
  }

  async getProfile(userId: string) {
    console.log(`[UserService] getProfile called for userId: ${userId}`);
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { role: true },
      });

      if (!user) {
        console.log(
          `[UserService] User not found in database for id: ${userId}`,
        );
        throw new NotFoundException('User not found');
      }

      console.log(`[UserService] User found`);
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



    // 1. Update Database (Source of Truth for Display)
    // Includes: Image, Name, Phone
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
}
