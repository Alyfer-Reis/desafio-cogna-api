import { Module } from '@nestjs/common';
import { TaskRepositoryPrisma } from 'src/infra/repository/prisma/task-repository.prisma';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  providers: [
    TaskService,
    {
      provide: 'TaskRepositoryInterface',
      useClass: TaskRepositoryPrisma,
    },
  ],
})
export class TaskModule {}
