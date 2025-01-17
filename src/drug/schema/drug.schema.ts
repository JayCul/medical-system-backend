import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Drug extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
    _id: MongooseSchema.Types.ObjectId;

    
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  brandName: string;

  @Prop({ required: true })
  dosageForms: string[]; // Format: "TABLET 2.5 mg/1"
}

export const DrugSchema = SchemaFactory.createForClass(Drug);
// export const DrugCollectionSchema = SchemaFactory.createForClass(DrugCollection);



// export const DrugSchema = SchemaFactory.createForClass(Drug);
