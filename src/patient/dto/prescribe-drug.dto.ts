import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class prescribeDrugDto {
  @IsString()
  @ApiProperty()
  pharmacistId: string;

  @IsString()
  @ApiProperty()
  prescription: string;
}
