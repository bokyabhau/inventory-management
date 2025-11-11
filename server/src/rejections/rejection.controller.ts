import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { RejectionService } from './rejection.service';
import { CreateRejectionDto, UpdateRejectionDto } from './dto/rejection.dto';

@Controller('rejections')
export class RejectionController {
  constructor(private readonly rejectionService: RejectionService) {}

  @Post()
  async create(@Body() createRejectionDto: CreateRejectionDto) {
    return this.rejectionService.create(createRejectionDto);
  }

  @Get()
  async findAll() {
    return this.rejectionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const rejection = await this.rejectionService.findOne(id);
    if (!rejection) {
      throw new NotFoundException(`Rejection with ID ${id} not found`);
    }
    return rejection;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRejectionDto: UpdateRejectionDto) {
    const rejection = await this.rejectionService.update(id, updateRejectionDto);
    if (!rejection) {
      throw new NotFoundException(`Rejection with ID ${id} not found`);
    }
    return rejection;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const rejection = await this.rejectionService.remove(id);
    if (!rejection) {
      throw new NotFoundException(`Rejection with ID ${id} not found`);
    }
    return rejection;
  }
}