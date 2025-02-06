import { Injectable } from '@nestjs/common';
import { Fund } from '@verp/shared';

@Injectable()
export class FundsService {
  private funds: Fund[] = [];

  async findAll(): Promise<Fund[]> {
    return this.funds;
  }

  async findOne(id: string): Promise<Fund | undefined> {
    return this.funds.find(fund => fund.id === id);
  }

  async create(fund: Omit<Fund, 'id'>): Promise<Fund> {
    const newFund: Fund = {
      ...fund,
      id: Math.random().toString(36).substring(2, 15),
    };
    this.funds.push(newFund);
    return newFund;
  }

  async update(id: string, fund: Partial<Fund>): Promise<Fund | undefined> {
    const index = this.funds.findIndex(f => f.id === id);
    if (index === -1) return undefined;

    this.funds[index] = {
      ...this.funds[index],
      ...fund,
      id, // Ensure ID doesn't change
    };
    return this.funds[index];
  }

  async remove(id: string): Promise<boolean> {
    const index = this.funds.findIndex(f => f.id === id);
    if (index === -1) return false;

    this.funds.splice(index, 1);
    return true;
  }
}