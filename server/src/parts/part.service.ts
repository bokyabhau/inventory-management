import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Part, PartDocument } from '../database/schemas/part.schema';

@Injectable()
export class PartService {
  constructor(@InjectModel(Part.name) private partModel: Model<PartDocument>) {}

  async create(createPartDto: { name: string }): Promise<Part> {
    try {
      const createdPart = new this.partModel(createPartDto);
      return createdPart.save();
    } catch (error) {
      console.error('Error creating part:', error);
      throw new InternalServerErrorException(error?.message ?? 'Failed to create part');
    }
  }

  async findAll(): Promise<Part[]> {
    return this.partModel.find().exec();
  }

  async findOne(id: string): Promise<Part> {
    const part = await this.partModel.findById(id).exec();
    if (!part) {
      throw new NotFoundException(`Part with id ${id} not found`);
    }
    return part;
  }

  async update(id: string, updatePartDto: { name: string }): Promise<Part> {
    const updated = await this.partModel
      .findByIdAndUpdate(id, updatePartDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Part with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<Part> {
    const removed = await this.partModel.findByIdAndDelete(id).exec();
    if (!removed) {
      throw new NotFoundException(`Part with id ${id} not found`);
    }
    return removed;
  }
}
