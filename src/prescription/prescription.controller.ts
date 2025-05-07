import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Prescription')
@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  @ApiBody({ type: CreatePrescriptionDto })
  async create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionService.create(createPrescriptionDto);
  }

  @Post('dispense/:id')
  @ApiBody({ type: Boolean })
  async dispense(
    @Param('id') id: string,
    @Body('isDispensed') isDispensed: boolean,
  ) {
    // console.log(id, isDispensed)

    return await this.prescriptionService.dispense(id, isDispensed);
  }

  @Get()
  async findAll(
    @Query() query: { stats: boolean; page: number; limit: number },
  ) {
    const { stats, page, limit } = query;
    return this.prescriptionService.findAll(page || 1, limit || 10, stats);
  }

  @Get('search')
  async search(@Query() query: { text: string; page: number; limit: number }) {
    const { text, page, limit } = query;
    return this.prescriptionService.search(text, page || 1, limit || 10);
  }

  @Get('stats')
  async getStats() {
    return this.prescriptionService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prescriptionService.findOne(id);
  }

  // @Get('filter-by-stats')
  // filterByStats(@Query() query : {stats:boolean; page: number; limit: number}) {
  //   const {stats, page, limit} = query;

  //   return this.prescriptionService.filterByStats(stats, page, limit);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prescriptionService.remove(id);
  }
}
