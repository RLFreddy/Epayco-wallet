import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import {
  PaymentSession,
  SessionStatus,
} from './entities/payment-session.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentSession)
    private readonly sessionRepository: Repository<PaymentSession>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async initiate(
    initiatePaymentDto: InitiatePaymentDto,
  ): Promise<PaymentSession> {
    const user = await this.usersService.findByDocumentAndCellphone(
      initiatePaymentDto.document,
      initiatePaymentDto.cellphone,
    );
    if (Number(user.balance) < Number(initiatePaymentDto.amount)) {
      throw new BadRequestException('Fondos insuficientes.');
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // Token válido por 5 minutos

    const session = this.sessionRepository.create({
      user,
      amount: initiatePaymentDto.amount,
      token,
      expiresAt,
      status: SessionStatus.PENDING,
    });

    return this.sessionRepository.save(session);
  }

  async confirm(
    confirmPaymentDto: ConfirmPaymentDto,
  ): Promise<{ message: string }> {
    const session = await this.sessionRepository.findOne({
      where: {
        id: confirmPaymentDto.sessionId,
        token: confirmPaymentDto.token,
        status: SessionStatus.PENDING,
      },
      relations: ['user'],
    });

    if (!session) {
      throw new NotFoundException('ID de sesión o token inválido.');
    }
    if (new Date() > session.expiresAt) {
      session.status = SessionStatus.EXPIRED;
      await this.sessionRepository.save(session);
      throw new BadRequestException('El token de pago ha expirado.');
    }

    const user = session.user;
    if (Number(user.balance) < Number(session.amount)) {
      throw new BadRequestException(
        'Fondos insuficientes al momento de la confirmación.',
      );
    }

    // Usar una transacción para garantizar la atomicidad
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      user.balance = Number(user.balance) - Number(session.amount);
      await queryRunner.manager.save(user);

      session.status = SessionStatus.CONFIRMED;
      await queryRunner.manager.save(session);

      await queryRunner.commitTransaction();
      return { message: 'Pago confirmado exitosamente.' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('La confirmación del pago falló.');
    } finally {
      await queryRunner.release();
    }
  }
}
