import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, BadRequestException, Put } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientService } from './patient.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/auth/roles.enum';
import { RequireRoles } from 'src/decorator/roles.decorator';
import { ReturningPatientDto } from './dto/returning-patient.dto';
import { CreatePrescriptionDto } from 'src/prescription/dto/create-prescription.dto';
import { ObjectId } from 'typeorm';

// @UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('patient')
// @RequireRoles(Roles.Admin, Roles.Doctor, Roles.Nurse)
export class PatientController {
    constructor(private readonly patientService: PatientService) {}

    @Get()
    async findAll(@Query() query : {page: number; limit: number}) {
      const {page, limit} = query;
      return this.patientService.findAll(page || 1, limit || 10);
    }

    @Get('search-by-name')
    async searchName(@Query() query : {name: string; page: number; limit: number}) {
      const {name, page, limit} = query;

        console.log('Query parameters:', { name, page, limit });
        return this.patientService.findPatientByName(name, page || 1, limit || 10);
    }
    
  @Post('new')
  async create(@Body() createPatientDto: CreatePatientDto) {
    console.log(createPatientDto)
    return this.patientService.create(createPatientDto);
  }

  @Get(':id')
    async findOne(@Param('id') id: string) {
      console.log(id)
      return this.patientService.findOne(id);
    }
  
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.patientService.remove(id);
  }

    
    @Post(':patientId/register-returning')
  async registerReturningPatient(@Body() returningPatientDto: ReturningPatientDto, @Param('patientId') patientId: string){
    return this.patientService.registerReturningPatient(returningPatientDto, patientId);
  }
  
  @Post(':patientId/to-doctor')
  async assignDoctor(@Body() doctorId: string, @Param('patientId') patientId: string ){
    return this.patientService.assignDoctor(patientId, doctorId);
  }
  
  @Post(':patientId/to-nurse')
  async assignNurse(@Body() nurseId: string, @Param('patientId') patientId: string ){
    return this.patientService.assignNurse(patientId, nurseId);
  }
  
  @Post(':patientId/to-lab')
  async sendToLab(@Body() mlsId: string, @Param('patientId') patientId: string ){
    return this.patientService.sendToLab(patientId, mlsId);
  }

  @Post(':patientId/after-lab')
  async afterLab(@Body() body: { doctorId: string; labResult: string}, @Param('patientId') patientId: string){
    const { doctorId, labResult } = body;
    
    return this.patientService.afterLab(patientId, doctorId, labResult);
  }
  
  @Post(':patientId/prescribe')
  async prescribeMeds(@Body() body: {pharmacistId: string, prescription: CreatePrescriptionDto}, @Param('patientId') patientId: string){
    const { pharmacistId, prescription } = body;
    
    return this.patientService.prescribeMedication(patientId, pharmacistId, prescription)
  }  
  
  @Post(':patientId/discharge')
  async disscharge(@Param('patientId') patientId: string){
    return this.patientService.discharge(patientId);
  }

  @Put(':patientId/update')
  async update(@Param('patientId') patientId: any, @Body() patientData: any){
    return this.patientService.updatePatient(patientId, patientData)
  }
}

