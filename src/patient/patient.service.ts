import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Patient } from './schemas/patient.schema';
import { CreatePatientDto, UpdatePatientDto } from './dto/create-patient.dto';
import { Model, ObjectId } from 'mongoose';
import { ReturningPatientDto } from './dto/returning-patient.dto';
import { CreatePrescriptionDto } from 'src/prescription/dto/create-prescription.dto';
import { Prescription } from 'src/prescription/schemas/prescription.schema';

@Injectable()
export class PatientService {
    constructor(
        @InjectModel(Patient.name) private readonly patientModel: Model<Patient>,
        @InjectModel(Prescription.name) private readonly PrescriptionModel: Model<Prescription>,
    ){}

    private async paginate(query: any, page: number, limit: number): Promise<{
        data: Patient[];
        totalPages: number;
        totalItems: number;
        currentPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        rangeStart: number;
        rangeEnd: number;
      }> {
        if (page < 1 || limit < 1) {
          throw new Error('Page and limit must be positive numbers.');
        }
    
        const totalItems = await this.patientModel.countDocuments(query).exec();
        const totalPages = Math.ceil(totalItems / limit);
        const skip = (page - 1) * limit;
    
        const data = await this.patientModel
          .find(query)
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit)
          .exec();
    
          console.log('Paginate Querysss:', query);

        const rangeStart = skip + 1;
        const rangeEnd = Math.min(skip + limit, totalItems);
    
        return {
          data,
          totalPages,
          totalItems,
          currentPage: page,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          rangeStart,
          rangeEnd,
        };
      }
    async create(createPatientDto: CreatePatientDto):Promise<{message, patient}>{

        const newPatient = new this.patientModel({...createPatientDto, admittedStatus: {in: true}});
        newPatient.save();

        return {
            message: "Patient created successfully",
            patient: newPatient
        }
    }
    async findAll(page: number, limit: number) {
        return this.paginate({}, page, limit);
    }
    
    async findOne(id: string): Promise<Patient> {
        return await this.patientModel.findById(id).exec();
    }
    
    async remove(id: string): Promise<Patient> {
        return this.patientModel.findByIdAndDelete(id).exec();
    }
    
    // async registerNewPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
        //     const newPatient = new this.patientModel(createPatientDto);
        //     return newPatient.save();
        // }
        
        async findPatientByName(name: string, page?: number, limit?: number) {
            const regex = new RegExp(name, 'i');
            const filter = { name: regex }; // Match names case-insensitively
            console.log('Filter:', filter);
          
            // return this.paginate(filter, page, limit);
            return this.paginate(filter, page, limit);
          }
          
    
    async registerReturningPatient(returningPatientDto: ReturningPatientDto, patientId: string): Promise<Patient> {
        const returningPatient = await this.patientModel.findByIdAndUpdate(patientId, 
            {
                ...returningPatientDto,
                admittedStatus: {in: true}
            }, { new: true });
        
        if (!returningPatient) {
            throw new Error(`No patient found with ID: ${patientId}`);
        }
        return returningPatient;
    }

    async updatePatient(patientId: any, patientDto: UpdatePatientDto): Promise<{message, patient}>{
        const updatedPatient = await this.patientModel.findByIdAndUpdate(patientId, patientDto).exec()

        if (!updatedPatient) {
            throw new Error(`No patient found with ID: ${patientId}`);
        }
        return {
            message: "Patient updated successfully",
            patient: updatedPatient
        }
    }

    async assignDoctor(patientId: string, doctorId: string): Promise<Patient> {
        return await this.patientModel.findByIdAndUpdate(
          patientId,
          { assignedDoctor: doctorId, currentLocation: 'doctor' },
          { new: true },
        );
      }
    
      async afterLab(patientId: string, doctorId: string, labResult: string): Promise<Patient> {
        return await this.patientModel.findByIdAndUpdate(
          patientId,
          { assignedDoctor: doctorId, currentLocation: 'doctor', additionalRemarks: labResult },
          { new: true },
        );
      }
    
      async assignNurse(patientId: string, nurseId: string): Promise<Patient> {
        return await this.patientModel.findByIdAndUpdate(
          patientId,
          { assignedNurse: nurseId, currentLocation: 'nurse' },
          { new: true },
        );
      }

    async sendToLab(patientId: string, mlsId: string): Promise<Patient> {
        return await this.patientModel.findByIdAndUpdate(
            patientId,
            { assignedMLSSession: mlsId, currentLocation: 'lab' },
            { new: true },
        );
    }
    
    async prescribeMedication(
        patientId: string,
        pharmacistId: string,
        prescriptionDto: CreatePrescriptionDto,
        ): Promise<Patient> {
        const prescription = new this.PrescriptionModel(prescriptionDto);
        await prescription.save();
    
    return await this.patientModel.findByIdAndUpdate(
        patientId,
        { assignedPharmacist: pharmacistId, 
        currentLocation: 'pharmacy' },
        { new: true },
    );
    }
      
    async discharge(patientId: string): Promise<Patient> {
        const updatedPatient = await this.patientModel.findByIdAndUpdate(
            patientId, 
            { admittedStatus: { in: false } }, // Update the admittedStatus field
            { new: true } // Return the updated document
        );
    
        if (!updatedPatient) {
            throw new Error(`No patient found with ID: ${patientId}`);
        }
    
        return updatedPatient;
    }
    
  
    
      

}
