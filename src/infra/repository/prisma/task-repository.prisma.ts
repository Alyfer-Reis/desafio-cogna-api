import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from 'src/domain/entity/Task';
import { TaskRepositoryInterface } from 'src/domain/repository/task-repository.interface';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class TaskRepositoryPrisma implements TaskRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(task: Task): Promise<void> {
    await this.prisma.task.create({
      data: {
        id: task.id,
        userId: task.userId,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    const taskData = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!taskData) return null;

    return Task.reconstruct({
      id: taskData.id,
      userId: taskData.userId,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status as TaskStatus,
      createdAt: taskData.createdAt,
      updatedAt: taskData.updatedAt,
    });
  }

  async findAllByUserId(userId: string): Promise<Task[]> {
    const tasksData = await this.prisma.task.findMany({
      where: { userId },
    });

    return tasksData.map((data) =>
      Task.reconstruct({
        id: data.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        status: data.status as TaskStatus,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }),
    );
  }

  async update(task: Task): Promise<void> {
    await this.prisma.task.update({
      where: { id: task.id },
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
        updatedAt: task.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: { id },
    });
  }
}
