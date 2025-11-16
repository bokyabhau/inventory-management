import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataEntry, DataEntrySchema } from '../database/schemas/data-entry.schema';
import { DataEntryController } from './data-entry.controller';
import { DataEntryService } from './data-entry.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DataEntry.name, schema: DataEntrySchema }])
  ],
  controllers: [DataEntryController],
  providers: [DataEntryService],
})
export class DataEntryModule {}
