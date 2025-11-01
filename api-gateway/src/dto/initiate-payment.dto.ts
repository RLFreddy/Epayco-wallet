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
    description: 'Documento del cliente que realiza el pago',
    example: '10203040',
  })
  @IsString({ message: 'El documento debe ser un texto.' })
  @IsNotEmpty({ message: 'El documento es requerido.' })
  @Length(5, 20, {
    message: 'El documento debe tener entre 5 y 20 caracteres.',
  })
  document: string;

  @ApiProperty({
    description: 'Celular del cliente que realiza el pago',
    example: '3001234567',
  })
  @IsString({ message: 'El celular debe ser un texto.' })
  @IsNotEmpty({ message: 'El celular es requerido.' })
  @Length(10, 15, {
    message: 'El celular debe tener entre 10 y 15 caracteres.',
  })
  cellphone: string;

  @ApiProperty({
    description: 'Monto de la compra a pagar',
    example: 15000,
  })
  @IsNumber({}, { message: 'El monto debe ser un número.' })
  @IsPositive({ message: 'El monto debe ser un número positivo.' })
  amount: number;
}
