import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { RechargeWalletDto } from './dto/recharge-wallet.dto';
import { CheckBalanceDto } from './dto/check-balance.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  async recharge(
    rechargeDto: RechargeWalletDto,
  ): Promise<{ newBalance: number }> {
    const user = await this.usersService.findByDocumentAndCellphone(
      rechargeDto.document,
      rechargeDto.cellphone,
    );
    user.balance = Number(user.balance) + Number(rechargeDto.value);
    await this.userRepository.save(user);
    return { newBalance: user.balance };
  }

  async getBalance(
    checkBalanceDto: CheckBalanceDto,
  ): Promise<{ balance: number }> {
    const user = await this.usersService.findByDocumentAndCellphone(
      checkBalanceDto.document,
      checkBalanceDto.cellphone,
    );
    return { balance: user.balance };
  }
}
