import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rejection, RejectionDocument } from '../database/schemas/rejection.schema';

@Injectable()
export class RejectionService {
  constructor(
    @InjectModel(Rejection.name) private rejectionModel: Model<RejectionDocument>,
  ) {}

  async create(createRejectionDto: { name: string }): Promise<Rejection> {
    const createdRejection = new this.rejectionModel(createRejectionDto);
    return createdRejection.save();
  }

  async findAll(): Promise<Rejection[]> {
    return this.rejectionModel.find().exec();
  }

  async findOne(id: string): Promise<Rejection> {
    const rejection = await this.rejectionModel.findById(id).exec();
    if (!rejection) {
      throw new NotFoundException(`Rejection with ID ${id} not found`);
    }
    return rejection;
  }

  async update(id: string, updateRejectionDto: { name: string }): Promise<Rejection> {
    const rejection = await this.rejectionModel
      .findByIdAndUpdate(id, updateRejectionDto, { new: true })
      .exec();
    if (!rejection) {
      throw new NotFoundException(`Rejection with ID ${id} not found`);
    }
    return rejection;
  }

  async remove(id: string): Promise<Rejection> {
    const deletion = await this.rejectionModel.findByIdAndDelete(id).exec();
    if (!deletion) {
      throw new NotFoundException(`Rejection with ID ${id} not found`);
    }
    return deletion;
  }
}