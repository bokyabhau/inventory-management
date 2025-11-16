import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataEntry, DataEntryDocument } from '../database/schemas/data-entry.schema';
import { CreateDataEntryDto, UpdateDataEntryDto } from './dto/data-entry.dto';

@Injectable()
export class DataEntryService {
  constructor(@InjectModel(DataEntry.name) private dataEntryModel: Model<DataEntryDocument>) {}

  async create(createDataEntryDto: CreateDataEntryDto): Promise<DataEntry> {
    try {
      const createdDataEntry = new this.dataEntryModel(createDataEntryDto);
      return createdDataEntry.save();
    } catch (error) {
      console.error('Error creating data entry:', error);
      throw new InternalServerErrorException(error?.message ?? 'Failed to create data entry');
    }
  }

  async findAll(): Promise<DataEntry[]> {
    return this.dataEntryModel
      .find()
      .populate('part')
      .populate('rejection')
      .exec();
  }

  async findOne(id: string): Promise<DataEntry> {
    const dataEntry = await this.dataEntryModel
      .findById(id)
      .populate('part')
      .populate('rejection')
      .exec();
    if (!dataEntry) {
      throw new NotFoundException(`Data entry with id ${id} not found`);
    }
    return dataEntry;
  }

  async update(id: string, updateDataEntryDto: UpdateDataEntryDto): Promise<DataEntry> {
    const updated = await this.dataEntryModel
      .findByIdAndUpdate(id, updateDataEntryDto, { new: true })
      .populate('part')
      .populate('rejection')
      .exec();

    if (!updated) {
      throw new NotFoundException(`Data entry with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<DataEntry> {
    const removed = await this.dataEntryModel.findByIdAndDelete(id).exec();
    if (!removed) {
      throw new NotFoundException(`Data entry with id ${id} not found`);
    }
    return removed;
  }
}
