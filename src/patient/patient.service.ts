import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Patient } from './schemas/patient.schema';
import { CreatePatientDto, UpdatePatientDto } from './dto/create-patient.dto';
import { Model, ObjectId } from 'mongoose';
import { CreatePrescriptionDto } from 'src/prescription/dto/create-prescription.dto';
import { Prescription } from 'src/prescription/schemas/prescription.schema';

import { UnauthorizedException, NotFoundError } from '../exceptions/exceptions';


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
        return await this.patientModel.findById(id).populate('assignedDoctor assignedNurse assignedPharmacist assignedMLSSession', 'name').exec();
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
          
    async findAllNames(): Promise<Patient[]>{
        return await this.patientModel.find().sort({ name: 1 }).select('name').exec();
    }
    
    async registerReturningPatient(returningPatientDto: UpdatePatientDto, patientId: string): Promise<any> {
        const patient = await this.patientModel.findById(patientId).exec();
    
        // Check if patient exists
        if (!patient) {
            throw new Error(`No patient found with ID: ${patientId}`);
        }
    
        // Safely check the admittedStatus
        if (patient.admittedStatus[0]?.in === true) {
            return { message: "Patient already admitted", patient };
        }
    
        // Update the patient record
        const returningPatient = await this.patientModel.findByIdAndUpdate(
            patientId,
            {
                ...returningPatientDto,
                admittedStatus: { in: true }
            },
            { new: true }
        );
    
        if (!returningPatient) {
            throw new Error(`Failed to update patient with ID: ${patientId}`);
        }
    
        return { message: "Patient admitted successfully", returningPatient };
    }
    

    async updatePatient(patientId: any, patientDto: UpdatePatientDto): Promise<{message, patient}>{
        const updatedPatient = await this.patientModel.findByIdAndUpdate(patientId, {...patientDto}, {new: true}).exec()

        if (!updatedPatient) {
            throw new Error(`No patient found with ID: ${patientId}`);
        }
        return {
            message: "Patient updated successfully",
            patient: updatedPatient
        }
    }

    async assignDoctor(patientId: string, doctorId: string, additionalRemarks: string): Promise<{message, updatedPatient}> {  
        const patient = await this.patientModel.findById(patientId).exec();
        this.isPatientAdmitted(patient)
        const updatedPatient = await this.patientModel.updateOne(
            { _id: patientId },
            [
              {
                $set: {
                    assignedDoctor: doctorId, currentLocation: 'doctor',
                  additionalRemarks: {
                    $concat: [patient.additionalRemarks, " ", "\nNurse: " ,additionalRemarks],
                  },
                },
              },
            ]
          );
        return {message: "Patient updated successfully", updatedPatient: updatedPatient}
    }
    
      async afterLab(patientId: string, doctorId: string, labResult: string): Promise<{message, updatedPatient}> {
        const patient = await this.patientModel.findById(patientId).exec();
        
        
        const updatedPatient = await this.patientModel.updateOne(
            { _id: patientId },
            [
              {
                $set: {
                  assignedDoctor: doctorId, currentLocation: 'doctor',
                  additionalRemarks: {
                    $concat: [patient.additionalRemarks, " ", "\Lab-result: " ,labResult],
                  },
                },
              },
            ]
          );
        return {message: "Patient updated successfully", updatedPatient: updatedPatient}
    }
    
    async assignNurse(patientId: string, nurseId: string, additionalRemarks: string): Promise<{message, updatedPatient}> {
        const patient = await this.patientModel.findById(patientId).exec();
        this.isPatientAdmitted(patient);
        
        
        const updatedPatient = await this.patientModel.updateOne(
            { _id: patientId },
            [
              {
                $set: {
                    assignedNurse: nurseId, 
                    currentLocation: 'nurse',
                  additionalRemarks: {
                    $concat: [patient.additionalRemarks, " ", "\nDoctor: " ,additionalRemarks],
                  },
                },
              },
            ]
          );
        return {message: "Patient updated successfully", updatedPatient: updatedPatient}
    }
    
    async sendToLab(patientId: string, mlsId: string, additionalRemarks: string): Promise<{message, updatedPatient}> {
        const patient = await this.patientModel.findById(patientId).exec();
        this.isPatientAdmitted(patient);
        
        const updatedPatient = await this.patientModel.updateOne(
            { _id: patientId },
            [
              {
                $set: {
                  assignedMLSSession: mlsId,
                  currentLocation: 'lab',
                  additionalRemarks: {
                    $concat: [patient.additionalRemarks, " ", "\nDoctor: " ,additionalRemarks],
                  },
                },
              },
            ]
          );
        return {message: "Patient updated successfully", updatedPatient: updatedPatient}
    }
    
    async prescribeMedication(
        patientId: string,
        pharmacistId: string,
        prescriptionDto: CreatePrescriptionDto,
    ): Promise<{message, updatedPatient}> {
        // console.log(prescriptionDto)
         
        // Create and save the new prescription
        
        // Fetch the current patient data
        const patient = await this.patientModel.findById(patientId).exec();
        this.isPatientAdmitted(patient);
        const prescription = new this.PrescriptionModel(prescriptionDto);
        await prescription.save();

    
        // Update the patient's data with the new prescription and history
        const updatedPatient = await this.patientModel.findByIdAndUpdate(
            patientId,
            {
                $set: {
                    assignedPharmacist: pharmacistId,
                    currentLocation: 'pharmacy',
                },
                currPrescription: {
                    date: new Date(),
                    diagnosis: patient.additionalRemarks,
                    doctor: patient.assignedDoctor,
                    prescription: prescription._id, // Reference to the prescription
                },
                
            },
            { new: true },
        ).exec();

        return {message: "Prescription added successfully", updatedPatient}
    }
    
      
    async discharge(patientId: string): Promise<any> {
        const patient = await this.patientModel.findById(patientId).exec();

        this.isPatientAdmitted(patient);
        // Update the first entry in admittedStatus to mark the patient as discharged
        patient.admittedStatus[0].in = false;
        patient.admittedStatus[0].timeOut = new Date(); // Set the discharge time
        patient.medicalHistory.push(patient.currPrescription);
        // Add a new entry to admittedStatus for the next admission
        const newStatus = {
            in: false,
            timeIn: null,
            timeOut: null,
        };
        patient.admittedStatus.unshift(newStatus); // Add the new entry to the beginning of the array
    
        // Save the updated patient document
        await patient.save();
        
        return {message: "Patient Discharged Successfully", patient};
    }
    
    isPatientAdmitted(patient){

        if (!patient) {
            throw new NotFoundError (`Patient not found`);
        }
    
        // Check if the patient is currently admitted
        if (!patient.admittedStatus[0]?.in) {
            throw new NotAcceptableException ("Patient is not currently admitted");
        }
        // if (!patient.admittedStatus[0]?.in) {
        //     return 
        //       statusCode: 401,
        //       message: "Patient is not currently admitted",
        //     };
        //   }

        
    
    }
  
    
      

}
