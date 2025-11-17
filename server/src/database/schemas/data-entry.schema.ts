import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Part } from './part.schema';
import { Rejection } from './rejection.schema';

export type DataEntryDocument = DataEntry & Document;

interface RejectionDetail {
  reason: Rejection;
  numberOfRejections: number;
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      const { _id, __v, ...rest } = ret;
      (rest as { id: any }).id = _id;
      // Convert all Date fields to ISO strings
      const result = rest as any;
      if (result.date instanceof Date) {
        result.date = result.date.toISOString();
      }
      if (result.createdAt instanceof Date) {
        result.createdAt = result.createdAt.toISOString();
      }
      if (result.updatedAt instanceof Date) {
        result.updatedAt = result.updatedAt.toISOString();
      }
      return result;
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

  @Prop({
    type: [
      {
        reason: { type: Types.ObjectId, ref: 'Rejection', required: true },
        numberOfRejections: { type: Number, required: true, min: 0 },
      },
    ],
    required: true,
  })
  rejections: RejectionDetail[];

  @Prop({ required: true, min: 0, default: 0 })
  totalRejections: number;

  @Prop({ required: true })
  lotNumber: string;

  @Prop({ type: Date, default: () => new Date().toISOString() })
  createdAt: Date;

  @Prop({ type: Date, default: () => new Date().toISOString() })
  updatedAt: Date;
}

export const DataEntrySchema = SchemaFactory.createForClass(DataEntry);
