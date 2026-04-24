import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutRequest } from '../entities/checkout-request.entity';
import { Equipment } from '../entities/equipment.entity';
import { CheckoutRequestsController } from './checkout-requests.controller';
import { CheckoutRequestsService } from './checkout-requests.service';

@Module({
  imports: [TypeOrmModule.forFeature([CheckoutRequest, Equipment])],
  controllers: [CheckoutRequestsController],
  providers: [CheckoutRequestsService],
  exports: [CheckoutRequestsService],
})
export class CheckoutRequestsModule {}