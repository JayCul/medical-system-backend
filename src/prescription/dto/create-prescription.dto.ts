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

import { IsNotEmpty, IsString, IsArray, ValidateNested, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

class MedicationDto {
  @IsString()
  @IsNotEmpty()
  drugName: string;

  @IsString()
  @IsNotEmpty()
  dosage: string; // e.g., "50mg"

  @IsString()
  @IsNotEmpty()
  frequency: string; // e.g., "Twice a day"

  @IsString()
  @IsNotEmpty()
  duration: string; // e.g., "7 days"
}

export class CreatePrescriptionDto {
  @IsNotEmpty()
  @IsString()
  patient: Types.ObjectId; // Reference to the patient

  @IsNotEmpty()
  @IsString()
  doctor: Types.ObjectId; // Reference to the prescribing doctor

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicationDto)
  medications: MedicationDto[];

  @IsOptional()
  @IsBoolean()
  isDispensed?: boolean; // Optional, defaults to false
}
