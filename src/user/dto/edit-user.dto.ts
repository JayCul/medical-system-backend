import { IsString, IsOptional, IsEmail, IsEnum, IsArray } from 'class-validator';
import { Types } from 'mongoose';
import { Roles } from '../../auth/roles.enum';

export class EditUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(Roles, { message: 'Invalid role provided' })
  role?: Roles;
  
  @IsOptional()
  @IsString()
  status?: boolean; // For updating the password if necessary

  @IsOptional()
  @IsString()
  password?: string; // For updating the password if necessary

//   @IsOptional()
//   @IsArray()
//   managedPatients?: Types.ObjectId[]; // IDs of patients managed by the user

//   @IsOptional()
//   @IsArray()
//   issuedPrescriptions?: Types.ObjectId[]; // IDs of prescriptions issued by the user
}
