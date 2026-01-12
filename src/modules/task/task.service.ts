import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from 'src/domain/entity/Task';
import type { TaskRepositoryInterface } from 'src/domain/repository/task-repository.interface';
import {
  TaskChangeStatusDto,
  TaskDto,
  TaskOutputDto,
} from './task.dto';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TaskRepositoryInterface')
    private readonly taskRepository: TaskRepositoryInterface,
  ) {}

  async create(userId: string, taskCreateDto: TaskDto): Promise<void> {
    const task = Task.create({
      userId,
      title: taskCreateDto.title,
      description: taskCreateDto.description,
    });

    await this.taskRepository.create(task);
  }

  async getAll(userId: string): Promise<TaskOutputDto[]> {
    const tasks = await this.taskRepository.findAllByUserId(userId);
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));
  }

  async findById(userId: string, id: string): Promise<TaskOutputDto> {
    const task = await this.taskRepository.findById(id, userId);
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  async update(userId: string, id: string, taskUpdateDto: TaskDto): Promise<void> {
    console.log('Updating task with DTO:', taskUpdateDto);
    const task = await this.taskRepository.findById(id, userId);
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    task.update(taskUpdateDto.title, taskUpdateDto.description);

    await this.taskRepository.update(task);
  }

  async changeStatus(
    userId: string,
    id: string,
    taskChangeStatusDto: TaskChangeStatusDto,
  ): Promise<void> {
    const task = await this.taskRepository.findById(
      id,
      userId,
    );
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    task.changeStatus(taskChangeStatusDto.status);
    await this.taskRepository.update(task);
  }

  async delete(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
