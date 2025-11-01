import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { UsersModule } from '../users/users.module';
import { PaymentSession } from './entities/payment-session.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentSession, // ← Para sessionRepository
      User, // ← Para que DataSource funcione con User
    ]),
    UsersModule, // ← Para UsersService
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService], // ← Si otros módulos necesitan PaymentsService
})
export class PaymentsModule {}
