import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { PartService } from './part.service';
import { CreatePartDto, UpdatePartDto } from './dto/part.dto';

@Controller('parts')
export class PartController {
  constructor(private readonly partService: PartService) {}

  @Post()
  async create(@Body() createPartDto: CreatePartDto) {
    return this.partService.create(createPartDto);
  }

  @Get()
  async findAll() {
    console.log('Fetching all parts');
    return this.partService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const part = await this.partService.findOne(id);
    if (!part) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }
    return part;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePartDto: UpdatePartDto) {
    const part = await this.partService.update(id, updatePartDto);
    if (!part) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }
    return part;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const part = await this.partService.remove(id);
    if (!part) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }
    return part;
  }
}