import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionService.create(createPrescriptionDto);
  }

  @Get()
  findAll(@Query() query : {stats:boolean; page: number; limit: number}) {
    const {stats, page, limit} = query;
    return this.prescriptionService.findAll(page || 1, limit || 10, stats);
  }
  
  @Get('search')
  search(@Query() query : {text:string; page: number; limit: number}) {
    const {text, page, limit} = query;
    return this.prescriptionService.search(text, page || 1, limit || 10);
  }

  @Get('stats')
  getStats(){
    return this.prescriptionService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
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
