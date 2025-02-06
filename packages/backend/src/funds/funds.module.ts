import { Module } from '@nestjs/common';
import { FundsController } from './funds.controller.js';
import { FundsService } from './funds.service.js';

@Module({
  controllers: [FundsController],
  providers: [FundsService],
  exports: [FundsService],
})
export class FundsModule {}