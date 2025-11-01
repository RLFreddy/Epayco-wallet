import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class RechargeWalletDto {
  @ApiProperty({
    description: 'Documento de identidad del cliente',
    example: '10203040',
  })
  @IsString({ message: 'El documento debe ser un texto.' })
  @IsNotEmpty({ message: 'El documento es requerido.' })
  @Length(5, 20, {
    message: 'El documento debe tener entre 5 y 20 caracteres.',
  })
  document: string;

  @ApiProperty({
    description: 'Número de celular del cliente',
    example: '3001234567',
  })
  @IsString({ message: 'El celular debe ser un texto.' })
  @IsNotEmpty({ message: 'El celular es requerido.' })
  @Length(10, 15, {
    message: 'El celular debe tener entre 10 y 15 caracteres.',
  })
  cellphone: string;

  @ApiProperty({
    description: 'Valor a recargar en la billetera',
    example: 50000,
  })
  @IsNumber({}, { message: 'El valor debe ser un número.' })
  @IsPositive({ message: 'El valor debe ser un número positivo.' })
  @Min(1000, { message: 'El valor mínimo de recarga es 1000.' })
  value: number;
}
