import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundsController } from './funds.controller.js';
import { FundsService } from './funds.service.js';
import {
  Fund,
  LimitedPartnership,
  LimitedPartner,
  GeneralPartner,
  PortfolioCompany,
  Transaction,
} from './entities/index.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Fund,
      LimitedPartnership,
      LimitedPartner,
      GeneralPartner,
      PortfolioCompany,
      Transaction,
    ]),
  ],
  controllers: [FundsController],
  providers: [FundsService],
  exports: [FundsService],
})
export class FundsModule {}