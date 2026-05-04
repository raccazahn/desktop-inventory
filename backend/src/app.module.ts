import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Equipment } from './entities/equipment.entity';
import { Checkout } from './entities/checkout.entity';
import { CheckoutRequest } from './entities/checkout-request.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EquipmentModule } from './equipment/equipment.module';
import { CheckoutModule } from './checkout/checkout.module';
import { CheckoutRequestsModule } from './checkout-requests/checkout-requests.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'lab_inventory.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      // ✅ Removed invalid connectOptions property
    }),
    UsersModule,
    AuthModule,
    EquipmentModule,
    CheckoutModule,
    CheckoutRequestsModule,
  ],
})
export class AppModule {}