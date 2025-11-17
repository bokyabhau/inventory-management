import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PreferenceDocument = Preference & Document;

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
export class Preference {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  value: string;

  @Prop({ type: Date, default: () => new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedAt: Date;
}

export const PreferenceSchema = SchemaFactory.createForClass(Preference);
