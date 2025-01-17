import { IsString, IsInt, IsNotEmpty, IsIn, IsArray } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  age: number;

  @IsInt()
  height: number;

  @IsInt()
  weight: number;
  
  @IsString()
  bloodPressure: string;
  
  @IsInt()
  bloodOxygen: number;
  
  @IsString()
  @IsIn(['male', 'female', 'other'])
  gender: string;

  @IsString()
  address: string;

  @IsString()
  contact: string;
  
  @IsString()
  @IsIn(['stable', 'unstable'])
  healthStatus: string;
  
  @IsString()
  complaints: string;
}

export class UpdatePatientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  age: number;

  @IsInt()
  height: number;

  @IsInt()
  weight: number;
  
  @IsString()
  bloodPressure: string;
  
  @IsInt()
  bloodOxygen: number;
  
  @IsString()
  @IsIn(['male', 'female', 'other'])
  gender: string;

  @IsString()
  address: string;

  @IsString()
  contact: string;
  
  @IsString()
  @IsIn(['stable', 'unstable'])
  healthStatus: string;
  
  @IsString()
  @IsIn(['Requires Surgury', 'Critical Vitals', 'Emergency Room'])
  alerts: string;
  
  @IsArray()
  medicalHistory: {};
  
  @IsArray()
  admittedStatus: {};
  
  @IsString()
  @IsIn(['doctor', 'lab', 'pharmacy', 'nurse'])
  currentLocation: string;
  
  @IsString()
  complaints: string;
  
  @IsString()
  additionalRemarks: string;
}

