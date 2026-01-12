import { IsEmail, IsUUID, MinLength } from 'class-validator';
import { Entity } from './Entity';
import Password from './Password';

export default class User extends Entity {
  private constructor(
    id: string | null,
    readonly name: string,
    readonly email: string,
    private _password: Password,
  ) {
    super(id);
  }

  static async create(props: UserCreateInput): Promise<User> {
    const validator = new UserCreateInput(props);
    this.validateCreate(validator);

    return new User(
      null,
      props.name,
      props.email,
      await Password.create(props.password),
    );
  }

  static reconstruct(props: UserReconstructInput): User {
    const validator = new UserReconstructInput(props);
    this.validateReconstruct(validator);

    return new User(
      props.id,
      props.name,
      props.email,
      new Password(props.password),
    );
  }

  get password(): string {
    return this._password.value;
  }

  async validatePassword(password: string): Promise<boolean> {
    return await this._password.validate(password);
  }
}

class UserCreateInput {
  @MinLength(5, { message: 'Nome deve ter pelo menos 5 caracteres' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;

  constructor(props: any) {
    Object.assign(this, props);
  }
}

class UserReconstructInput extends UserCreateInput {
  @IsUUID('4', { message: 'ID inválido' })
  id: string;

  constructor(props: any) {
    super(props);
    Object.assign(this, props);
  }
}
