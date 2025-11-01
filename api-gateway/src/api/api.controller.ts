import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiService } from './api.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { RechargeWalletDto } from '../dto/recharge-wallet.dto';
import { InitiatePaymentDto } from '../dto/initiate-payment.dto';
import { ConfirmPaymentDto } from '../dto/confirm-payment.dto';
import { CheckBalanceDto } from '../dto/check-balance.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Wallet Operations')
@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo cliente en la billetera' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Cliente registrado con éxito.',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 400,
    description: 'Datos inválidos.',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 409,
    description: 'El cliente ya existe.',
    type: ApiResponse,
  })
  register(@Body() createUserDto: CreateUserDto) {
    return this.apiService.register(createUserDto);
  }

  @Post('recharge')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recargar saldo a una billetera existente' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Recarga exitosa.',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Cliente no encontrado.',
    type: ApiResponse,
  })
  recharge(@Body() rechargeWalletDto: RechargeWalletDto) {
    return this.apiService.recharge(rechargeWalletDto);
  }

  @Post('balance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Consultar el saldo de una billetera' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Consulta exitosa.',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Cliente no encontrado.',
    type: ApiResponse,
  })
  getBalance(@Body() checkBalanceDto: CheckBalanceDto) {
    return this.apiService.getBalance(checkBalanceDto);
  }

  @Post('payments/initiate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar un proceso de pago y enviar token de confirmación',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Token de pago enviado. Se retorna el ID de sesión.',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 400,
    description: 'Fondos insuficientes.',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Cliente no encontrado.',
    type: ApiResponse,
  })
  initiatePayment(@Body() initiatePaymentDto: InitiatePaymentDto) {
    return this.apiService.initiatePayment(initiatePaymentDto);
  }

  @Post('payments/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirmar un pago usando el ID de sesión y el token',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Pago confirmado exitosamente.',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 400,
    description: 'Token expirado o fondos insuficientes al confirmar.',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'ID de sesión o token inválido.',
    type: ApiResponse,
  })
  confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    return this.apiService.confirmPayment(confirmPaymentDto);
  }
}
