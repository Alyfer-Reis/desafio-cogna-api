import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from 'src/domain/entity/User';
import type { UserRepositoryInterface } from 'src/domain/repository/user-repository.interface';
import type {
  AuthenticateInput,
  AuthenticateOutput,
  RegisterUserInput,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private jwtService: JwtService,
  ) {}

  async register(props: RegisterUserInput): Promise<void> {
    const userExists = await this.userRepository.findByEmail(props.email);

    if (userExists) {
      throw new NotFoundException('Usuário já existe');
    }

    const user = await User.create({
      name: props.name,
      email: props.email,
      password: props.password,
    });

    await this.userRepository.create(user);
  }

  async login(props: AuthenticateInput): Promise<AuthenticateOutput> {
    const user = await this.userRepository.findByEmail(props.email);

    if (!user || !(await user.validatePassword(props.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }
}
