import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { DataEntryService } from './data-entry.service';
import { CreateDataEntryDto, UpdateDataEntryDto } from './dto/data-entry.dto';

@Controller('data-entries')
export class DataEntryController {
  constructor(private readonly dataEntryService: DataEntryService) {}

  @Post()
  async create(@Body() createDataEntryDto: CreateDataEntryDto) {
    return this.dataEntryService.create(createDataEntryDto);
  }

  @Get()
  async findAll() {
    console.log('Fetching all data entries');
    return this.dataEntryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const dataEntry = await this.dataEntryService.findOne(id);
    if (!dataEntry) {
      throw new NotFoundException(`Data entry with ID ${id} not found`);
    }
    return dataEntry;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDataEntryDto: UpdateDataEntryDto) {
    const dataEntry = await this.dataEntryService.update(id, updateDataEntryDto);
    if (!dataEntry) {
      throw new NotFoundException(`Data entry with ID ${id} not found`);
    }
    return dataEntry;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const dataEntry = await this.dataEntryService.remove(id);
    if (!dataEntry) {
      throw new NotFoundException(`Data entry with ID ${id} not found`);
    }
    return dataEntry;
  }
}
