import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Drug } from './schema/drug.schema';
import { Model } from 'mongoose';
import { DrugDto } from './dto/drug.dto';
import { ObjectId } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class DrugService {
    constructor(
        @InjectModel(Drug.name) private readonly drugModel: Model<Drug>
    ){}

    private async paginate(query: any, page: number, limit: number): Promise<{
        data: Drug[];
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
    
        const totalItems = await this.drugModel.countDocuments(query).exec();
        const totalPages = Math.ceil(totalItems / limit);
        const skip = (page - 1) * limit;
    
        const data = await this.drugModel
          .find(query)
          .sort({ name: 1 })
          .select('-password')
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

    async searchDrugsByName(name: string, page: number, limit: number){
        const regex = new RegExp(name, 'i')
        return this.paginate({ $or: [{name: regex}, {brandName: regex}]}, page, limit)
    }
    
    async searchDrugsById(id: string){
        // const regex = new RegExp(name, 'i')
        // console.log(regex)
        const drug = await this.drugModel.findById(id).exec()
        if (!drug){
            throw new NotFoundException(`Could not find drug with id ${id}`)
        } 
        return drug
    }
    
    async getDrugUsageForms(id: string): Promise<string[]>{
        console.log(id)
        const drug = await this.drugModel.findById(id)

        if (!drug){
            throw new NotFoundException(`Could not find drug with id ${id}`)
        } 
        
        return drug.dosageForms || []
    }
    
    async delDrugbyId(id: string): Promise<Drug>{
        const Drug = await this.drugModel.findByIdAndDelete(id).exec()
        if (!Drug){
            throw new NotFoundException(`Could not find drug with id ${id}`)
        } 

        return Drug
    }
    
    async updateDrugById(id: string, drug: Partial<Drug>): Promise<Drug> {
        const updatedDrug = await this.drugModel
          .findByIdAndUpdate(id, drug, { new: true, runValidators: true })
          .exec();
        console.log(drug);
        console.log(updatedDrug);
      
        if (!updatedDrug) {
          throw new NotFoundException(`Could not find drug with id ${id}`);
        }
      
        return updatedDrug;
      }

    async create(drugDto: DrugDto):Promise<Drug>{
        const { name, dosageForms } = drugDto;
        console.log(name)
            let existingDrug = await this.drugModel.findOne({name}).exec()

            if (!existingDrug){
                const newDrug = new this.drugModel(drugDto);
                // console.log(newDrug)
                return newDrug.save();
            } else {
                const updatedDosageForms = Array.from(
                new Set([...(existingDrug.dosageForms || []), ...(dosageForms || [])])
                );
                existingDrug.dosageForms = updatedDosageForms;
                return existingDrug.save();    
            }

        // Update the existing drug's dosageForms field

        }

        async fetchDrugs( page?: number, limit?: number ){ 
            return this.paginate({}, page, limit);
        }
          

}
