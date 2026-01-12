import { compare, hash } from 'bcrypt';

export default class Password {
  constructor(private readonly hashed: string) {
    if (!this.isHash(hashed)) {
      throw new Error('A string fornecida não é um hash Bcrypt válido.');
    }
  }

  get value(): string {
    return this.hashed;
  }

  private isHash(value: string): boolean {
    const bcryptRegex = /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/;
    return bcryptRegex.test(value);
  }

  static async create(password: string): Promise<Password> {
    const saltRounds = 10;
    const hashedValue = await hash(password, saltRounds);
    return new Password(hashedValue);
  }

  async validate(password: string): Promise<boolean> {
    return await compare(password, this.hashed);
  }
}
