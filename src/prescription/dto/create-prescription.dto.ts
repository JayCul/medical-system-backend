// import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

// export class CreatePrescriptionDto {
//   @IsMongoId()
//   patient: string;

//   @IsMongoId()
//   prescribedBy: string;

//   @IsString()
//   @IsNotEmpty()
//   medicineName: string;

//   @IsString()
//   @IsNotEmpty()
//   dosage: string;

//   @IsString()
//   @IsNotEmpty()
//   frequency: string;
// }

import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

class MedicationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  drugName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  dosage: string; // e.g., "50mg"

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  frequency: string; // e.g., "Twice a day"

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  duration: string; // e.g., "7 days"
}

export class CreatePrescriptionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  patient: Types.ObjectId; // Reference to the patient

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  doctor: Types.ObjectId; // Reference to the prescribing doctor

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicationDto)
  @ApiProperty()
  medications: MedicationDto[];

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isDispensed?: boolean; // Optional, defaults to false
}
