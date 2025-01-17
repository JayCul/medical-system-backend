import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Roles } from '../../auth/roles.enum';

// @Schema()
// export class User extends Document {
//   @Prop({ required: true, unique: true })
//   username: string;

//   @Prop({ required: true })
//   password: string;

//   @Prop({ required: true, enum: Roles })
//   role: Roles;
// }

// export const UserSchema = SchemaFactory.createForClass(User);

@Schema()
export class User extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: false, trim: true })
  name: string;

//   default: () => nanoid(10),
  @Prop({ type: String, unique: true, required: true, trim: true })
  username: string;

  @Prop({ required: true, enum: Roles, default: Roles.User })
  role: Roles;

  @Prop({
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ type: String, required: true, trim: true, minlength: 6 })
  password: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Date, default: () => new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  lastLogin: Date;

  @Prop([{ type: Types.ObjectId, ref: 'Patient' }])
  managedPatients: Types.ObjectId[]; // For doctors/nurses managing patients

  @Prop([{ type: Types.ObjectId, ref: 'Prescription' }])
  issuedPrescriptions: Types.ObjectId[]; // For doctors creating prescriptions

  @Prop({ type: Object })
  customSettings: Record<string, any>; // Dynamic user-specific settings
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);


