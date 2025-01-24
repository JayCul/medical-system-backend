import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";

@Schema()
export class Prescription extends Document{

    @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
    _id: MongooseSchema.Types.ObjectId;  

    @Prop({
        required: true,
        trim: true,
        unique: true,
        default: () => `RX-${new Date().toISOString().split('T')[0]}-${Math.random().toString(36).substr(2, 8)}`,
      })
    prescriptionId: string;


    @Prop({type: Types.ObjectId, ref: 'Patient', required: true})
    patient: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    doctor: Types.ObjectId;

    @Prop({
        type: [
          {
            // _id: {type: Types.ObjectId, ref: 'Drug'},
            drug: { type: String, required: true },
            dosage: { type: String, required: true }, // e.g., "50mg"
            frequency: { type: String, required: true }, // e.g., "Twice a day"
            duration: { type: String, required: true }, // e.g., "7 days"
          },
        ],
      })
      medications: {
        drug: string;
        dosage: string;
        frequency: string;
        duration: string;
      }[];
    
      @Prop({ type: Boolean, default: false })
      isDispensed: boolean; // Whether the medication has been dispensed
    
      @Prop({ type: Date, default: Date.now })
      issuedAt: Date;
    
      @Prop({ type: Date })
      dispensedAt: Date; // When the medication was dispensed
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);