import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class editLocationDto {
  @IsString()
  @ApiProperty()
  _id: string;

  @IsString()
  @ApiProperty()
  additionalRemarks: string;
}
