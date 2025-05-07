import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class labResultDto {
  @IsString()
  @ApiProperty()
  doctorId: string;

  @IsString()
  @ApiProperty()
  labResult: string;
}
