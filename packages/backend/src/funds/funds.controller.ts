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
import { FundsService } from './funds.service.js';
import {
  Fund,
  LimitedPartnership,
  LimitedPartner,
  GeneralPartner,
  PortfolioCompany,
  Transaction,
} from './entities/index.js';

@ApiTags('funds')
@Controller('funds')
export class FundsController {
  constructor(private readonly fundsService: FundsService) {}

  // Fund endpoints
  @Get()
  @ApiOperation({ summary: 'Get all funds' })
  @ApiResponse({ status: 200, description: 'List of all funds' })
  async findAll(): Promise<Fund[]> {
    return this.fundsService.findAllFunds();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a fund by ID' })
  @ApiResponse({ status: 200, description: 'The found fund' })
  @ApiResponse({ status: 404, description: 'Fund not found' })
  async findOne(@Param('id') id: string): Promise<Fund> {
    const fund = await this.fundsService.findFundById(id);
    if (!fund) {
      throw new NotFoundException(`Fund with ID ${id} not found`);
    }
    return fund;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new fund' })
  @ApiResponse({ status: 201, description: 'The fund has been created' })
  async create(@Body() fund: Partial<Fund>): Promise<Fund> {
    return this.fundsService.createFund(fund);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a fund' })
  @ApiResponse({ status: 200, description: 'The fund has been updated' })
  @ApiResponse({ status: 404, description: 'Fund not found' })
  async update(
    @Param('id') id: string,
    @Body() fund: Partial<Fund>
  ): Promise<Fund> {
    const updatedFund = await this.fundsService.updateFund(id, fund);
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
    const deleted = await this.fundsService.deleteFund(id);
    if (!deleted) {
      throw new NotFoundException(`Fund with ID ${id} not found`);
    }
  }

  // Limited Partnership endpoints
  @Get(':fundId/partnerships')
  @ApiOperation({ summary: 'Get all limited partnerships for a fund' })
  @ApiResponse({ status: 200, description: 'List of limited partnerships' })
  async findLimitedPartnerships(@Param('fundId') fundId: string): Promise<LimitedPartnership[]> {
    return this.fundsService.findAllLimitedPartnerships(fundId);
  }

  @Post(':fundId/partnerships')
  @ApiOperation({ summary: 'Create a new limited partnership' })
  @ApiResponse({ status: 201, description: 'The limited partnership has been created' })
  async createLimitedPartnership(
    @Param('fundId') fundId: string,
    @Body() partnership: Partial<LimitedPartnership>
  ): Promise<LimitedPartnership> {
    return this.fundsService.createLimitedPartnership(fundId, partnership);
  }

  // Portfolio Company endpoints
  @Get('portfolio-companies')
  @ApiOperation({ summary: 'Get all portfolio companies' })
  @ApiResponse({ status: 200, description: 'List of portfolio companies' })
  async findPortfolioCompanies(): Promise<PortfolioCompany[]> {
    return this.fundsService.findAllPortfolioCompanies();
  }

  @Post('portfolio-companies')
  @ApiOperation({ summary: 'Create a new portfolio company' })
  @ApiResponse({ status: 201, description: 'The portfolio company has been created' })
  async createPortfolioCompany(@Body() company: Partial<PortfolioCompany>): Promise<PortfolioCompany> {
    return this.fundsService.createPortfolioCompany(company);
  }

  // Partner endpoints
  @Post(':fundId/partnerships/:lpId/limited-partners')
  @ApiOperation({ summary: 'Add a limited partner to a partnership' })
  @ApiResponse({ status: 201, description: 'The limited partner has been added' })
  async addLimitedPartner(
    @Param('lpId') lpId: string,
    @Body() partner: Partial<LimitedPartner>
  ): Promise<LimitedPartner> {
    return this.fundsService.addLimitedPartner(lpId, partner);
  }

  @Post(':fundId/partnerships/:lpId/general-partners')
  @ApiOperation({ summary: 'Add a general partner to a partnership' })
  @ApiResponse({ status: 201, description: 'The general partner has been added' })
  async addGeneralPartner(
    @Param('lpId') lpId: string,
    @Body() partner: Partial<GeneralPartner>
  ): Promise<GeneralPartner> {
    return this.fundsService.addGeneralPartner(lpId, partner);
  }

  // Transaction endpoints
  @Post(':fundId/partnerships/:lpId/transactions')
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'The transaction has been created' })
  async createTransaction(
    @Param('lpId') lpId: string,
    @Body() transaction: Partial<Transaction>
  ): Promise<Transaction> {
    return this.fundsService.createTransaction({
      ...transaction,
      limitedPartnershipId: lpId,
    });
  }

  @Get(':fundId/partnerships/:lpId/transactions')
  @ApiOperation({ summary: 'Get all transactions for a partnership' })
  @ApiResponse({ status: 200, description: 'List of transactions' })
  async findTransactions(@Param('lpId') lpId: string): Promise<Transaction[]> {
    return this.fundsService.findTransactionsByLimitedPartnership(lpId);
  }
}