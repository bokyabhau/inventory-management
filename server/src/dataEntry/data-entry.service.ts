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
    endDate?: string,
    loadNumberStart?: string,
    loadNumberEnd?: string,
    inspectorName?: string,
    rejectionPercentageMin?: string,
    rejectionPercentageMax?: string,
    allParts?: string
  ): Promise<DataEntry[]> {
    let query: any = {};

    console.log('Filter called with params:', {
      partName,
      startDate,
      endDate,
      loadNumberStart,
      loadNumberEnd,
      inspectorName,
      rejectionPercentageMin,
      rejectionPercentageMax,
      allParts
    });

    // Filter by part names (skip if allParts is true)
    if (!allParts && partName) {
      const partNames = partName.split(',').map(p => p.trim());
      const partIds = await this.getPartIds(partNames);

      console.log('Filtering by part names:', partNames, 'resolved IDs:', partIds);

      if (partIds.length > 0) {
        query.part = { $in: partIds };
      } else {
        console.warn('No parts found for names:', partNames);
        return [];
      }
    } else if (allParts === 'true') {
      console.log('Selecting all parts');
      // Don't filter by part - include all parts
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        console.log('Filtering from startDate:', startDate);
        const startDateObj = new Date(startDate);
        query.date.$gte = startDateObj;
      }
      if (endDate) {
        console.log('Filtering up to endDate:', endDate);
        const endDateObj = new Date(endDate);
        query.date.$lte = endDateObj;
      }
    }

    // Filter by load number range
    if (loadNumberStart || loadNumberEnd) {
      query.lotNumber = {};
      if (loadNumberStart) {
        console.log('Filtering from loadNumberStart:', loadNumberStart);
        query.lotNumber.$gte = loadNumberStart;
      }
      if (loadNumberEnd) {
        console.log('Filtering up to loadNumberEnd:', loadNumberEnd);
        query.lotNumber.$lte = loadNumberEnd;
      }
    }

    // Filter by inspector name (case-insensitive)
    if (inspectorName) {
      console.log('Filtering by inspectorName:', inspectorName);
      query.inspectorName = { $regex: inspectorName, $options: 'i' };
    }

    console.log('Final filter query:', query);

    let dataEntries = await this.dataEntryModel
      .find(query)
      .populate('part')
      .populate('rejections.reason')
      .exec();

    // Filter by rejection percentage range (client-side since it requires calculation)
    if (rejectionPercentageMin || rejectionPercentageMax) {
      const minPercentage = rejectionPercentageMin ? parseFloat(rejectionPercentageMin) : 0;
      const maxPercentage = rejectionPercentageMax ? parseFloat(rejectionPercentageMax) : 100;

      dataEntries = dataEntries.filter(entry => {
        const rejectionPercentage = entry.numberOfParts > 0
          ? (entry.totalRejections / entry.numberOfParts) * 100
          : 0;
        return rejectionPercentage >= minPercentage && rejectionPercentage <= maxPercentage;
      });
    }

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
    return parts.map(part => part._id.toString());
  }
}
