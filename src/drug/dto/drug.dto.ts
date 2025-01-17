import { IsString, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';


export class DrugDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brandName: string;

  @IsString()
  @IsNotEmpty()
  dosageForms: string[];
}
