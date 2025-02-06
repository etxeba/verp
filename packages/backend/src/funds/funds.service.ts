import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Fund,
  LimitedPartnership,
  LimitedPartner,
  GeneralPartner,
  PortfolioCompany,
  Transaction,
} from './entities/index.js';

@Injectable()
export class FundsService {
  constructor(
    @InjectRepository(Fund)
    private fundsRepository: Repository<Fund>,
    @InjectRepository(LimitedPartnership)
    private limitedPartnershipsRepository: Repository<LimitedPartnership>,
    @InjectRepository(LimitedPartner)
    private limitedPartnersRepository: Repository<LimitedPartner>,
    @InjectRepository(GeneralPartner)
    private generalPartnersRepository: Repository<GeneralPartner>,
    @InjectRepository(PortfolioCompany)
    private portfolioCompaniesRepository: Repository<PortfolioCompany>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  // Fund methods
  async findAllFunds(): Promise<Fund[]> {
    return this.fundsRepository.find({
      relations: ['limitedPartnerships'],
    });
  }

  async findFundById(id: string): Promise<Fund | null> {
    return this.fundsRepository.findOne({
      where: { id },
      relations: ['limitedPartnerships'],
    });
  }

  async createFund(fundData: Partial<Fund>): Promise<Fund> {
    const fund = this.fundsRepository.create(fundData);
    return this.fundsRepository.save(fund);
  }

  async updateFund(id: string, fundData: Partial<Fund>): Promise<Fund | null> {
    await this.fundsRepository.update(id, fundData);
    return this.findFundById(id);
  }

  async deleteFund(id: string): Promise<boolean> {
    const result = await this.fundsRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  // Limited Partnership methods
  async findAllLimitedPartnerships(fundId: string): Promise<LimitedPartnership[]> {
    return this.limitedPartnershipsRepository.find({
      where: { fundId },
      relations: ['limitedPartners', 'generalPartners'],
    });
  }

  async findLimitedPartnershipById(id: string): Promise<LimitedPartnership | null> {
    return this.limitedPartnershipsRepository.findOne({
      where: { id },
      relations: ['limitedPartners', 'generalPartners', 'transactions'],
    });
  }

  async createLimitedPartnership(
    fundId: string,
    lpData: Partial<LimitedPartnership>,
  ): Promise<LimitedPartnership> {
    const limitedPartnership = this.limitedPartnershipsRepository.create({
      ...lpData,
      fundId,
    });
    return this.limitedPartnershipsRepository.save(limitedPartnership);
  }

  // Portfolio Company methods
  async findAllPortfolioCompanies(): Promise<PortfolioCompany[]> {
    return this.portfolioCompaniesRepository.find();
  }

  async findPortfolioCompanyById(id: string): Promise<PortfolioCompany | null> {
    return this.portfolioCompaniesRepository.findOne({
      where: { id },
      relations: ['transactions'],
    });
  }

  async createPortfolioCompany(companyData: Partial<PortfolioCompany>): Promise<PortfolioCompany> {
    const company = this.portfolioCompaniesRepository.create(companyData);
    return this.portfolioCompaniesRepository.save(company);
  }

  // Transaction methods
  async createTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionsRepository.create(transactionData);
    return this.transactionsRepository.save(transaction);
  }

  async findTransactionsByLimitedPartnership(lpId: string): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { limitedPartnershipId: lpId },
      relations: ['portfolioCompany'],
      order: { date: 'DESC' },
    });
  }

  // Partner methods
  async addLimitedPartner(
    lpId: string,
    partnerData: Partial<LimitedPartner>,
  ): Promise<LimitedPartner> {
    const partner = this.limitedPartnersRepository.create({
      ...partnerData,
      limitedPartnershipId: lpId,
    });
    return this.limitedPartnersRepository.save(partner);
  }

  async addGeneralPartner(
    lpId: string,
    partnerData: Partial<GeneralPartner>,
  ): Promise<GeneralPartner> {
    const partner = this.generalPartnersRepository.create({
      ...partnerData,
      limitedPartnershipId: lpId,
    });
    return this.generalPartnersRepository.save(partner);
  }

  // Performance metrics
  async calculateFundMetrics(fundId: string) {
    // TODO: Implement fund-level performance metrics calculation
    // This will use the performance_metrics_view we created
  }

  async calculateLimitedPartnershipMetrics(lpId: string) {
    // TODO: Implement LP-level performance metrics calculation
    // This will use the performance_metrics_view we created
  }
}