import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @IsString({ message: 'Senha inválida' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsString({ message: 'Nome inválido' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;
}

export type AuthenticateInput = {
  email: string;
  password: string;
};

export type AuthenticateOutput = {
  token: string;
  user: AuthenticatedUser;
};

export type AuthenticatedUser = {
  name: string;
  email: string;
};

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};
