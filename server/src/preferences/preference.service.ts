import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Preference, PreferenceDocument } from '../database/schemas/preference.schema';
import { CreatePreferenceDto, UpdatePreferenceDto } from './dto/preference.dto';

@Injectable()
export class PreferenceService {
  constructor(@InjectModel(Preference.name) private preferenceModel: Model<PreferenceDocument>) { }

  async create(createPreferenceDto: CreatePreferenceDto): Promise<Preference> {
    try {
      const existingPreference = await this.preferenceModel.findOne({
        name: createPreferenceDto.name,
      }).exec();

      if (existingPreference) {
        throw new ConflictException(`Preference with name "${createPreferenceDto.name}" already exists`);
      }

      const preference = new this.preferenceModel(createPreferenceDto);
      return preference.save();
    } catch (error) {
      console.error('Error creating preference:', error);
      if (error.status === 409) {
        throw error;
      }
      throw new InternalServerErrorException(error?.message ?? 'Failed to create preference');
    }
  }

  async findAll(): Promise<Preference[]> {
    return this.preferenceModel.find().exec();
  }

  async findOne(name: string): Promise<Preference> {
    const preference = await this.preferenceModel.findOne({ name }).exec();
    if (!preference) {
      throw new NotFoundException(`Preference with name "${name}" not found`);
    }
    return preference;
  }

  async update(name: string, updatePreferenceDto: UpdatePreferenceDto): Promise<Preference> {
    const updated = await this.preferenceModel
      .findOneAndUpdate({ name }, updatePreferenceDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Preference with name "${name}" not found`);
    }
    return updated;
  }

  async remove(name: string): Promise<Preference> {
    const removed = await this.preferenceModel.findOneAndDelete({ name }).exec();
    if (!removed) {
      throw new NotFoundException(`Preference with name "${name}" not found`);
    }
    return removed;
  }
}
