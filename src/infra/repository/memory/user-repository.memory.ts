import { Injectable } from '@nestjs/common';
import User from 'src/domain/entity/User';
import { UserRepositoryInterface } from 'src/domain/repository/user-repository.interface';

@Injectable()
export default class UserRepositoryMemory implements UserRepositoryInterface {
  private users: User[] = [];

  async create(user: User): Promise<void> {
    this.users.push(user);
    return Promise.resolve();
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return Promise.resolve(user || null);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    return Promise.resolve(user || null);
  }
}
