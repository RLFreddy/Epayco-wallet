import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class ConfirmPaymentDto {
  @ApiProperty({
    description: 'ID de la sesión de pago generado en el paso de iniciación',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID('4', { message: 'El ID de sesión debe ser un UUID válido.' })
  sessionId: string;

  @ApiProperty({
    description: 'Token de 6 dígitos enviado al correo del usuario',
    example: '123456',
  })
  @IsString({ message: 'El token debe ser un texto.' })
  @IsNotEmpty({ message: 'El token es requerido.' })
  @Length(6, 6, { message: 'El token debe tener exactamente 6 dígitos.' })
  token: string;
}
