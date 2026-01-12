import { Injectable } from '@nestjs/common';
import User from 'src/domain/entity/User';
import { UserRepositoryInterface } from 'src/domain/repository/user-repository.interface';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class UserRepositoryPrisma implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!userData) return null;

    return User.reconstruct({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
  }

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userData) return null;

    return User.reconstruct({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
  }
}
