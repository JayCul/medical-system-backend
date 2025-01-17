import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Prescription } from './schemas/prescription.schema';
import { Model } from 'mongoose';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Injectable()
export class PrescriptionService {
    constructor(
        @InjectModel(Prescription.name)
        private readonly prescriptionModel: Model<Prescription>,
    ){}

    async create(createPrescriptionDto: CreatePrescriptionDto):Promise<Prescription>{
        const newPrescription = new this.prescriptionModel(createPrescriptionDto);
        return newPrescription.save();
    }
    async findAll(): Promise<Prescription[]> {
        return this.prescriptionModel.find().populate('patient').populate('prescribedBy').exec();
      }

    async findOne(id: string): Promise<Prescription> {
        return this.prescriptionModel.findById(id).populate('patient').populate('prescribedBy').exec();
    }

    async remove(id: string): Promise<Prescription> {
        return this.prescriptionModel.findByIdAndDelete(id).exec();
    }
}