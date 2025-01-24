import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Patient extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  age: number;
  
  @Prop({ required: true })
  height: number;
  
  @Prop({ required: true })
  bloodPressure: string;
  
  @Prop({ required: true })
  bloodOxygen: number;
  
  @Prop({ required: true })
  weight: number;
  
  @Prop({ required: true, enum: ['male', 'female', 'other'] })
  gender: string;
  
  @Prop()
  address: string;

  @Prop()
  contact: string;

  @Prop({ type: String, default: 'stable' })
  healthStatus: string; // General health status

  @Prop([{ type: String, enum: ["Requires Surgery", 'Critical Vitals', 'Emergency Room'] }])
  alerts: string[]; // e.g., "Requires Surgery", "Critical Vitals"

  @Prop({
    type: {
        date: { type: Date, default: Date.now },
        diagnosis: { type: String, required: true },
        doctor: { type: Types.ObjectId, ref: 'User' }, // Doctor responsible
        prescription: { type: Types.ObjectId, ref: 'Prescription' }, // Linked prescription
      },
  })
  currPrescription: {
    date: Date;
    diagnosis: string;
    doctor: Types.ObjectId;
    prescription: Types.ObjectId;
  };

  @Prop({
    type: [
      {
        date: { type: Date, default: Date.now },
        diagnosis: { type: String, required: true },
        doctor: { type: Types.ObjectId, ref: 'User' }, // Doctor responsible
        prescription: { type: Types.ObjectId, ref: 'Prescription' }, // Linked prescription
      },
    ],
  })
  medicalHistory: {
    date: Date;
    diagnosis: string;
    doctor: Types.ObjectId;
    prescription: Types.ObjectId;
  }[];

  @Prop({ 
    type: [{
    in: {type: Boolean, default: false}, 
    timeIn: {type: Date, default: Date.now()},
    timeOut: {type: Date, default: null}
  }]
})
  admittedStatus: [{
    in: Boolean;
    timeIn: Date;
    timeOut: Date;
  }]

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedDoctor: Types.ObjectId; // The doctor currently responsible
  
  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedNurse: Types.ObjectId; // The doctor currently responsible

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedMLSSession: Types.ObjectId; // MLS session assigned for lab tests

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedPharmacist: Types.ObjectId; // Pharmacist responsible for prescriptions

  @Prop({ type: String, enum: ['doctor', 'lab', 'pharmacy', 'nurse'], default: 'nurse' })
  currentLocation: string; // Current care point

  @Prop({ type: String })
  complaints: string; // Patient-reported complaints
  
  @Prop({ type: String })
  additionalRemarks: string; // Patient-reported complaints
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
