import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from '@nestjs/common';
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

  @Get('filter')
  async filter(
    @Query('partName') partName?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('loadNumberStart') loadNumberStart?: string,
    @Query('loadNumberEnd') loadNumberEnd?: string,
    @Query('inspectorName') inspectorName?: string,
    @Query('rejectionPercentageMin') rejectionPercentageMin?: string,
    @Query('rejectionPercentageMax') rejectionPercentageMax?: string,
    @Query('allParts') allParts?: string
  ) {
    return this.dataEntryService.filter(
      partName,
      startDate,
      endDate,
      loadNumberStart,
      loadNumberEnd,
      inspectorName,
      rejectionPercentageMin,
      rejectionPercentageMax,
      allParts
    );
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
