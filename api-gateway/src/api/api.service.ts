import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';

import { CreateUserDto } from '../dto/create-user.dto';
import { RechargeWalletDto } from '../dto/recharge-wallet.dto';
import { CheckBalanceDto } from '../dto/check-balance.dto';
import { InitiatePaymentDto } from '../dto/initiate-payment.dto';
import { ConfirmPaymentDto } from '../dto/confirm-payment.dto';

@Injectable()
export class ApiService {
  private readonly dbServiceUrl: string;
  private readonly logger = new Logger(ApiService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    // Obtenemos la URL del servicio de base de datos desde las variables de entorno
    this.dbServiceUrl = this.configService.get<string>('DB_SERVICE_URL')!;
    if (!this.dbServiceUrl) {
      throw new Error('DB_SERVICE_URL environment variable is not set.');
    }
  }

  private async proxyRequest<T>(endpoint: string, data: any): Promise<T> {
    const url = `${this.dbServiceUrl}/${endpoint}`;
    this.logger.log(`Proxying request to: ${url}`);

    // Usamos `firstValueFrom` para convertir el Observable de Axios en una Promesa
    const request$ = this.httpService.post<T>(url, data).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(
          `Error from DB Service at ${url}:`,
          error.response?.data || error.message,
        );

        // Extraemos el mensaje y status del error del servicio subyacente
        const errorData = error.response?.data as any;
        const errorMessage =
          errorData?.message ||
          'Internal communication error with the data service.';
        const errorStatus = error.response?.status || 500;

        // Lanzamos una HttpException de NestJS para que nuestro filtro global la capture
        throw new HttpException(errorMessage, errorStatus);
      }),
    );

    const response = await firstValueFrom(request$);
    return response.data;
  }

  async register(createUserDto: CreateUserDto) {
    // El db-service no devuelve datos en el registro exitoso, solo un status 201.
    // Nosotros creamos un mensaje de éxito para el cliente.
    await this.proxyRequest('users/register', createUserDto);
    return { message: 'Cliente registrado con éxito.' };
  }

  async recharge(rechargeWalletDto: RechargeWalletDto) {
    // El db-service devuelve { newBalance: number }
    return this.proxyRequest('wallet/recharge', rechargeWalletDto);
  }

  async getBalance(checkBalanceDto: CheckBalanceDto) {
    // El db-service devuelve { balance: number }
    return this.proxyRequest('wallet/balance', checkBalanceDto);
  }

  async initiatePayment(initiatePaymentDto: InitiatePaymentDto) {
    const sessionData = await this.proxyRequest<any>(
      'payments/initiate',
      initiatePaymentDto,
    );

    try {
      await this.mailerService.sendMail({
        to: sessionData.user.email,
        subject: 'Tu código de confirmación de pago',
        template: 'payment-token', // apunta a /templates/payment-token.hbs
        context: {
          name: sessionData.user.names,
          token: sessionData.token,
        },
      });
      this.logger.log(
        `Confirmation email sent to ${sessionData.user.email} with token ${sessionData.token}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send confirmation email to ${sessionData.user.email}`,
        error,
      );
      throw new HttpException(
        'La sesión de pago se creó, pero falló el envío del correo de confirmación.',
        500,
      );
    }

    return {
      message:
        'Se ha enviado un correo con el token de confirmación. Úsalo para confirmar el pago.',
      sessionId: sessionData.id,
    };
  }

  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
    return this.proxyRequest('payments/confirm', confirmPaymentDto);
  }
}
