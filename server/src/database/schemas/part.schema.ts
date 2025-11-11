import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PartDocument = Part & Document;

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
export class Part {
  @Prop({ required: true, unique: true })
  name: string;
}

export const PartSchema = SchemaFactory.createForClass(Part);

PartSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.name = this.name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  next();
});
