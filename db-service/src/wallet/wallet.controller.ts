import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { RechargeWalletDto } from './dto/recharge-wallet.dto';
import { CheckBalanceDto } from './dto/check-balance.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('recharge')
  @HttpCode(HttpStatus.OK)
  recharge(@Body() rechargeWalletDto: RechargeWalletDto) {
    return this.walletService.recharge(rechargeWalletDto);
  }

  @Post('balance')
  @HttpCode(HttpStatus.OK)
  getBalance(@Body() checkBalanceDto: CheckBalanceDto) {
    return this.walletService.getBalance(checkBalanceDto);
  }
}
