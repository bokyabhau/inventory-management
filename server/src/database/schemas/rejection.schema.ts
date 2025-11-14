import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RejectionDocument = Rejection & Document;

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
export class Rejection {
  @Prop({ required: true, unique: true })
  name: string;
}

export const RejectionSchema = SchemaFactory.createForClass(Rejection);

// Middleware to convert name to title case before saving
RejectionSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.name = this.name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  next();
});
