import { Controller, Get, Post, Body, Patch, Delete, Param, HttpCode } from '@nestjs/common';
import { PreferenceService } from './preference.service';
import { CreatePreferenceDto, UpdatePreferenceDto } from './dto/preference.dto';
import { Preference } from '../database/schemas/preference.schema';

@Controller('preferences')
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) { }

  @Post()
  async create(@Body() createPreferenceDto: CreatePreferenceDto): Promise<Preference> {
    return this.preferenceService.create(createPreferenceDto);
  }

  @Get()
  async findAll(): Promise<Preference[]> {
    return this.preferenceService.findAll();
  }

  @Get(':name')
  async findOne(@Param('name') name: string): Promise<Preference> {
    return this.preferenceService.findOne(name);
  }

  @Patch(':name')
  async update(
    @Param('name') name: string,
    @Body() updatePreferenceDto: UpdatePreferenceDto,
  ): Promise<Preference> {
    return this.preferenceService.update(name, updatePreferenceDto);
  }

  @Delete(':name')
  @HttpCode(200)
  async remove(@Param('name') name: string): Promise<Preference> {
    return this.preferenceService.remove(name);
  }
}
