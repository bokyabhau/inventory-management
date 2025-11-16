import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Part } from './part.schema';
import { Rejection } from './rejection.schema';

export type DataEntryDocument = DataEntry & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      const { _id, __v, ...rest } = ret;
      (rest as { id: any }).id = _id;
      return rest;
    },
  },
})
export class DataEntry {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, enum: ['Day', 'Night'] })
  shift: string;

  @Prop({ required: true })
  inspectorName: string;

  @Prop({ type: Types.ObjectId, ref: 'Part', required: true })
  part: Part;

  @Prop({ required: true, min: 0 })
  numberOfParts: number;

  @Prop({ type: Types.ObjectId, ref: 'Rejection', required: true })
  rejection: Rejection;

  @Prop({ required: true, min: 0 })
  numberOfRejections: number;

  @Prop({ required: true })
  lotNumber: string;
}

export const DataEntrySchema = SchemaFactory.createForClass(DataEntry);
