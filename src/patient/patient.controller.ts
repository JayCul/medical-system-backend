import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { CreatePatientDto, UpdatePatientDto } from './dto/create-patient.dto';
import { PatientService } from './patient.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/auth/roles.enum';
import { RequireRoles } from 'src/decorator/roles.decorator';
import { CreatePrescriptionDto } from 'src/prescription/dto/create-prescription.dto';
import { ObjectId } from 'typeorm';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { editLocationDto } from './dto/edit-location.dto';
import { labResultDto } from './dto/lab-result.dto';
import { prescribeDrugDto } from './dto/prescribe-drug.dto';

@ApiTags('Patient')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('patient')
// @RequireRoles(Roles.Admin, Roles.Doctor, Roles.Nurse)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async findAll(@Query() query: { page: number; limit: number }) {
    const { page, limit } = query;
    return this.patientService.findAll(page || 1, limit || 10);
  }

  @Get('search-by-name')
  async searchName(
    @Query() query: { name: string; page?: number; limit?: number },
  ) {
    const { name, page, limit } = query;

    return this.patientService.findPatientByName(name, page, limit);
  }

  @Get('list-names')
  async listNames() {
    return this.patientService.findAllNames();
  }

  @Post('new')
  @ApiBody({ type: CreatePatientDto })
  async create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.patientService.remove(id);
  }

  @Post(':patientId/register-returning')
  @ApiBody({ type: UpdatePatientDto })
  async registerReturningPatient(
    @Body() returningPatientDto: UpdatePatientDto,
    @Param('patientId') patientId: string,
  ) {
    return this.patientService.registerReturningPatient(
      returningPatientDto,
      patientId,
    );
  }

  @Post(':patientId/to-doctor')
  @ApiBody({ type: editLocationDto })
  async assignDoctor(@Body() body: any, @Param('patientId') patientId: string) {
    const { _id, additionalRemarks } = body;
    // console.log(body)
    return this.patientService.assignDoctor(patientId, _id, additionalRemarks);
  }

  @Post(':patientId/to-nurse')
  @ApiBody({ type: editLocationDto })
  async assignNurse(@Body() body: any, @Param('patientId') patientId: string) {
    const { _id, additionalRemarks } = body;
    return this.patientService.assignNurse(patientId, _id, additionalRemarks);
  }

  @Post(':patientId/to-lab')
  @ApiBody({ type: editLocationDto })
  async sendToLab(@Body() body: any, @Param('patientId') patientId: string) {
    const { _id, additionalRemarks } = body;
    return this.patientService.sendToLab(patientId, _id, additionalRemarks);
  }

  @Post(':patientId/after-lab')
  @ApiBody({ type: labResultDto })
  async afterLab(
    @Body() body: { doctorId: string; labResult: string },
    @Param('patientId') patientId: string,
  ) {
    const { doctorId, labResult } = body;

    return this.patientService.afterLab(patientId, doctorId, labResult);
  }

  @Post(':patientId/prescribe')
  @ApiBody({ type: prescribeDrugDto })
  async prescribeMeds(
    @Body() body: { pharmacistId: string; prescription: CreatePrescriptionDto },
    @Param('patientId') patientId: string,
  ) {
    const { pharmacistId, prescription } = body;

    return this.patientService.prescribeMedication(
      patientId,
      pharmacistId,
      prescription,
    );
  }

  @Post(':patientId/discharge')
  async disscharge(@Param('patientId') patientId: string) {
    return this.patientService.discharge(patientId);
  }

  @Put(':patientId')
  async update(@Param('patientId') patientId: any, @Body() patientData: any) {
    return this.patientService.updatePatient(patientId, patientData);
  }
}
