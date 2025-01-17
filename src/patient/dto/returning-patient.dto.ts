import { IsString, IsInt} from 'class-validator';

export class ReturningPatientDto {
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
    complaints: string;
}
