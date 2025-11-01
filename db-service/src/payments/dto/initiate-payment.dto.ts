// File: db-service/src/payments/dto/initiate-payment.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class InitiatePaymentDto {
  @ApiProperty({
    description: 'Documento de identidad del cliente que paga',
    example: '10203040',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  document: string;

  @ApiProperty({
    description: 'Número de celular del cliente que paga',
    example: '3001234567',
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 15)
  cellphone: string;

  @ApiProperty({
    description: 'Monto de la compra a pagar',
    example: 15000,
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}
