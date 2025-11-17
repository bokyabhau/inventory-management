import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Preference, PreferenceSchema } from '../database/schemas/preference.schema';
import { PreferenceService } from './preference.service';
import { PreferenceController } from './preference.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Preference.name, schema: PreferenceSchema }])],
  controllers: [PreferenceController],
  providers: [PreferenceService],
  exports: [PreferenceService],
})
export class PreferenceModule { }
