import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { Prescription, PrescriptionSchema } from 'src/prescription/schemas/prescription.schema';
import { PrescriptionModule } from 'src/prescription/prescription.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Patient.name, schema: PatientSchema},
      {name: Prescription.name, schema: PrescriptionSchema}
    ]),
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService]
})
export class PatientModule {}
