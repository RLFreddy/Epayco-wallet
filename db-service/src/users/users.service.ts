import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { document: createUserDto.document },
        { email: createUserDto.email },
        { cellphone: createUserDto.cellphone },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'Ya existe un usuario con este documento, email o número de celular.',
      );
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findByDocumentAndCellphone(
    document: string,
    cellphone: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { document, cellphone },
    });
    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado o las credenciales no coinciden.',
      );
    }
    return user;
  }
}
