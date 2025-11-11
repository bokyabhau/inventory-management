import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Part, PartSchema } from './schemas/part.schema';
import { Rejection, RejectionSchema } from './schemas/rejection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Part.name, schema: PartSchema },
      { name: Rejection.name, schema: RejectionSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}