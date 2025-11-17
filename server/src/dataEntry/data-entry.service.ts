import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataEntry, DataEntryDocument } from '../database/schemas/data-entry.schema';
import { CreateDataEntryDto, UpdateDataEntryDto } from './dto/data-entry.dto';

@Injectable()
export class DataEntryService {
  constructor(@InjectModel(DataEntry.name) private dataEntryModel: Model<DataEntryDocument>) { }

  async create(createDataEntryDto: CreateDataEntryDto): Promise<DataEntry> {
    try {
      const totalRejections = createDataEntryDto.rejections.reduce(
        (sum, item) => sum + item.numberOfRejections,
        0
      );

      const dataEntry = {
        ...createDataEntryDto,
        // Convert ISO date strings to Date objects
        date: new Date(createDataEntryDto.date),
        totalRejections,
      };
      const createdDataEntry = new this.dataEntryModel(dataEntry);
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
      .populate('rejections.reason')
      .exec();
  }

  async findOne(id: string): Promise<DataEntry> {
    const dataEntry = await this.dataEntryModel
      .findById(id)
      .populate('part')
      .populate('rejections.reason')
      .exec();
    if (!dataEntry) {
      throw new NotFoundException(`Data entry with id ${id} not found`);
    }
    return dataEntry;
  }

  async update(id: string, updateDataEntryDto: UpdateDataEntryDto): Promise<DataEntry> {
    const updateData = { ...updateDataEntryDto };
    // Convert ISO date string to Date object if present
    if (updateData.date) {
      (updateData as any).date = new Date(updateData.date);
    }
    // Calculate totalRejections if rejections are being updated
    if (updateData.rejections) {
      (updateData as any).totalRejections = updateData.rejections.reduce(
        (sum, item) => sum + item.numberOfRejections,
        0
      );
    }
    const updated = await this.dataEntryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('part')
      .populate('rejections.reason')
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

  async filter(
    partName?: string,
    startDate?: string,
    endDate?: string
  ): Promise<DataEntry[]> {
    let query: any = {};

    console.log('Filter called with - partName:', partName, 'startDate:', startDate, 'endDate:', endDate);

    if (partName) {
      const partNames = partName.split(',').map(p => p.trim());
      const partIds = await this.getPartIds(partNames);

      console.log('Filtering by part names:', partNames, 'resolved IDs:', partIds);

      if (partIds.length > 0) {
        query = {
          ...query,
          part: { $in: partIds }
        };
      } else {
        console.warn('No parts found for names:', partNames);
        return [];
      }
    }

    if (startDate || endDate) {
      if (startDate) {
        console.log('Filtering from startDate:', startDate);
        const startDateObj = new Date(startDate);
        console.log('Converted startDate to Date object:', startDateObj);
        query = {
          ...query,
          createdAt: {
            ...query.createdAt,
            $gte: startDateObj
          }
        }
      }
      if (endDate) {
        console.log('Filtering up to endDate:', endDate);
        const endDateObj = new Date(endDate);
        console.log('Converted endDate to Date object:', endDateObj);
        query = {
          ...query,
          createdAt: {
            ...query.createdAt,
            $lte: endDateObj
          }
        }
      }
    }

    console.log('Final filter query:', JSON.stringify(query));

    const dataEntries = await this.dataEntryModel
      .find(query)
      .populate('part')
      .populate('rejection')
      .exec();

    console.log(`Found ${dataEntries.length} entries matching filter`);

    return dataEntries;
  }

  private async getPart(partName: string): Promise<string | null> {
    const Part = this.dataEntryModel.db.model('Part');
    const part = await Part.findOne({ name: partName }).exec();
    return part ? part._id : null;
  }

  private async getPartIds(partNames: string[]): Promise<string[]> {
    const Part = this.dataEntryModel.db.model('Part');
    const parts = await Part.find({ name: { $in: partNames } }).exec();
    return parts.map(part => part._id);
  }
}
