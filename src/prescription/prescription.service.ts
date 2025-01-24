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

    private async paginate(query: any, page: number, limit: number): Promise<{
        data: Prescription[];
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
    
        const totalItems = await this.prescriptionModel.countDocuments(query).exec();
        const totalPages = Math.ceil(totalItems / limit);
        const skip = (page - 1) * limit;
    
        const data = await this.prescriptionModel
          .find(query) 
          .sort({ prescriptionId: 1 })
          .populate('patient doctor', 'name')
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
    
    async create(createPrescriptionDto: CreatePrescriptionDto):Promise<Prescription>{
        const newPrescription = new this.prescriptionModel(createPrescriptionDto);
        return newPrescription.save();
    }
    async findAll(limit: number, page: number, stats?:boolean) {
        // return this.prescriptionModel.find().populate('patient').populate('prescribedBy').exec();
        let filter = {}
        if (stats) {
            filter = {isDispensed: stats}
        }
        return this.paginate(filter, limit, page)
      }
    
      async search(text:string, limit: number, page: number) {
        // return this.prescriptionModel.find().populate('patient').populate('prescribedBy').exec();
        let filter = RegExp(text, 'i')
        return this.paginate({prescriptionId: filter}, limit, page)
    }
    
    async findOne(id: string): Promise<Prescription> {
        return this.prescriptionModel.findById(id).populate('patient').populate('prescribedBy').exec();
    }
    
    async remove(id: string): Promise<Prescription> {
        return this.prescriptionModel.findByIdAndDelete(id).exec();
    }

    async getStats(): Promise<any>{
        const dispensedPrescription = await this.prescriptionModel.find({isDispensed: true}).countDocuments().exec()
        const undispensedPrescription = await this.prescriptionModel.find({isDispensed: false}).countDocuments().exec()

        return {dispensedPrescription, undispensedPrescription}
    }
    
    // async filterByStats(stats: boolean, limit: number, page: number){
    //     return this.paginate({isDidpensed: stats}, page, limit)
        
    // }
}