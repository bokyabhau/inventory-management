import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rejection, RejectionSchema } from '../database/schemas/rejection.schema';
import { RejectionController } from './rejection.controller';
import { RejectionService } from './rejection.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rejection.name, schema: RejectionSchema }])
  ],
  controllers: [RejectionController],
  providers: [RejectionService],
})
export class RejectionModule {}