import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Fund } from '@verp/shared';
import { FundsService } from './funds.service';

@ApiTags('funds')
@Controller('funds')
export class FundsController {
  constructor(private readonly fundsService: FundsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all funds' })
  @ApiResponse({ status: 200, description: 'List of all funds' })
  async findAll(): Promise<Fund[]> {
    return this.fundsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a fund by ID' })
  @ApiResponse({ status: 200, description: 'The found fund' })
  @ApiResponse({ status: 404, description: 'Fund not found' })
  async findOne(@Param('id') id: string): Promise<Fund> {
    const fund = await this.fundsService.findOne(id);
    if (!fund) {
      throw new NotFoundException(`Fund with ID ${id} not found`);
    }
    return fund;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new fund' })
  @ApiResponse({ status: 201, description: 'The fund has been created' })
  async create(@Body() fund: Omit<Fund, 'id'>): Promise<Fund> {
    return this.fundsService.create(fund);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a fund' })
  @ApiResponse({ status: 200, description: 'The fund has been updated' })
  @ApiResponse({ status: 404, description: 'Fund not found' })
  async update(
    @Param('id') id: string,
    @Body() fund: Partial<Fund>
  ): Promise<Fund> {
    const updatedFund = await this.fundsService.update(id, fund);
    if (!updatedFund) {
      throw new NotFoundException(`Fund with ID ${id} not found`);
    }
    return updatedFund;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a fund' })
  @ApiResponse({ status: 200, description: 'The fund has been deleted' })
  @ApiResponse({ status: 404, description: 'Fund not found' })
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.fundsService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Fund with ID ${id} not found`);
    }
  }
}