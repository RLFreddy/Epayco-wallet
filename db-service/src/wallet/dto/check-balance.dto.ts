import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CheckBalanceDto {
  @ApiProperty({
    description: 'Documento de identidad del cliente',
    example: '10203040',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  document: string;

  @ApiProperty({
    description: 'Número de celular del cliente',
    example: '3001234567',
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 15)
  cellphone: string;
}
