import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Equipment } from './entities/equipment.entity';
import { CheckoutRequest } from './entities/checkout-request.entity'; // ← ADD THIS
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EquipmentModule } from './equipment/equipment.module';
import { CheckoutRequestsModule } from './checkout-requests/checkout-requests.module'; // ← ADD THIS
import { CheckoutModule } from './checkout/checkout.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'lab_inventory.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    EquipmentModule,
    CheckoutModule,
    CheckoutRequestsModule, // ← ADD THIS
  ],
})
export class AppModule {}