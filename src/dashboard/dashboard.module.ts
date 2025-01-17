import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Patient, PatientSchema } from '../patient/schemas/patient.schema';
import { Prescription, PrescriptionSchema } from '../prescription/schemas/prescription.schema';
import { DashboardConfig, dashboardConfigSchema } from './schemas/dashboard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DashboardConfig.name, schema: dashboardConfigSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
