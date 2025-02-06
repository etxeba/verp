import { Module } from '@nestjs/common';
import { FundsModule } from './funds/funds.module';

@Module({
  imports: [FundsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}