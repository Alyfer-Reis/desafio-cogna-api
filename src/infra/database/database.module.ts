import { Global, Module } from '@nestjs/common';
import { TaskRepositoryPrisma } from '../repository/prisma/task-repository.prisma';
import { UserRepositoryPrisma } from '../repository/prisma/user-repository.prisma';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: 'TaskRepositoryInterface',
      useClass: TaskRepositoryPrisma,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepositoryPrisma,
    },
  ],
  exports: [
    PrismaService,
    'TaskRepositoryInterface',
    'UserRepositoryInterface',
  ],
})
export class DatabaseModule {}
