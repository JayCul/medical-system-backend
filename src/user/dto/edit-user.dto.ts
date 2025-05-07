import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Types } from 'mongoose';
import { Roles } from '../../auth/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class EditUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  username?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsEnum(Roles, { message: 'Invalid role provided' })
  @ApiProperty()
  role?: Roles;

  @IsOptional()
  @IsString()
  @ApiProperty()
  status?: boolean; // For updating the password if necessary

  @IsOptional()
  @IsString()
  @ApiProperty()
  password?: string; // For updating the password if necessary

  //   @IsOptional()
  //   @IsArray()
  //   managedPatients?: Types.ObjectId[]; // IDs of patients managed by the user

  //   @IsOptional()
  //   @IsArray()
  //   issuedPrescriptions?: Types.ObjectId[]; // IDs of prescriptions issued by the user
}
