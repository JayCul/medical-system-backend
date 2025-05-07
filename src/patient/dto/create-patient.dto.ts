import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty, IsIn, IsArray } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsInt()
  @ApiProperty()
  age: number;

  @IsInt()
  @ApiProperty()
  height: number;

  @IsInt()
  @ApiProperty()
  weight: number;

  @IsString()
  @ApiProperty()
  bloodPressure: string;

  @IsInt()
  @ApiProperty()
  bloodOxygen: number;

  @IsString()
  @IsIn(['male', 'female', 'other'])
  @ApiProperty()
  gender: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  contact: string;

  @IsString()
  @IsIn(['stable', 'unstable'])
  @ApiProperty()
  healthStatus: string;

  @IsString()
  @ApiProperty()
  complaints: string;
}

export class UpdatePatientDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsInt()
  @ApiProperty()
  age: number;

  @IsInt()
  @ApiProperty()
  height: number;

  @IsInt()
  @ApiProperty()
  weight: number;

  @IsString()
  @ApiProperty()
  bloodPressure: string;

  @IsInt()
  @ApiProperty()
  bloodOxygen: number;

  @IsString()
  @IsIn(['male', 'female', 'other'])
  @ApiProperty()
  gender: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  contact: string;

  @IsString()
  @ApiProperty()
  @IsIn(['stable', 'unstable'])
  healthStatus: string;

  @IsString()
  @ApiProperty()
  @IsIn(['Requires Surgury', 'Critical Vitals', 'Emergency Room'])
  alerts: string;

  @IsArray()
  @ApiProperty()
  medicalHistory: {};

  @IsArray()
  @ApiProperty()
  admittedStatus: {};

  @IsString()
  @IsIn(['doctor', 'lab', 'pharmacy', 'nurse'])
  @ApiProperty()
  currentLocation: string;

  @IsString()
  @ApiProperty()
  complaints: string;

  @IsString()
  @ApiProperty()
  additionalRemarks: string;
}
