import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Task, TaskStatus } from 'src/domain/entity/Task';
import { TaskRepositoryInterface } from 'src/domain/repository/task-repository.interface';
import TaskRepositoryMemory from 'src/infra/repository/memory/task-repository.memory';
import { TaskService } from './task.service';

const valueTaskInitial = {
  id: 'dc0a7c70-b7e7-47ad-bd38-2210309dbd40',
  userId: 'b21d15a6-0d1c-4b3d-8b67-d81586043529',
  title: 'Initial Task',
  description: 'Initial Description',
  status: TaskStatus.PENDING,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date(),
};

describe('TaskService', () => {
  let module: TestingModule;
  let service: TaskService;
  let repository: TaskRepositoryInterface;

  beforeEach(async () => {
    repository = new TaskRepositoryMemory();
    const task = Task.reconstruct(valueTaskInitial);
    await repository.create(task);

    module = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: 'TaskRepositoryInterface',
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const userId = 'user-2';
      const dto = { title: 'Test Task', description: 'Description' };

      await service.create(userId, dto);

      const tasks = await repository.findAllByUserId(userId);
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Test Task');
      expect(tasks[0].description).toBe('Description');
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const valuesUpdate = {
        title: 'New Title',
        description: 'New Description',
      };

      await service.update(valueTaskInitial.userId, valueTaskInitial.id, valuesUpdate);

      const existingTask = await repository.findById(
        valueTaskInitial.id,
        valueTaskInitial.userId,
      );
      expect(existingTask?.title).toBe(valuesUpdate.title);
      expect(existingTask?.description).toBe(valuesUpdate.description);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      await expect(
        service.update(valueTaskInitial.userId, 'non-existent-id', {
          title: '',
          description: '',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('changeStatus', () => {
    it('should change status successfully', async () => {
      const valuesStatus = {
        status: TaskStatus.COMPLETED,
      };

      await service.changeStatus(valueTaskInitial.userId, valueTaskInitial.id, valuesStatus);

      const existingTask = await repository.findById(
        valueTaskInitial.id,
        valueTaskInitial.userId,
      );
      expect(existingTask?.status).toBe(valuesStatus.status);
    });
  });

  describe('getAll', () => {
    it('should return a list of TaskOutputDto', async () => {
      const tasks = await service.getAll(valueTaskInitial.userId);
      expect(tasks).toHaveLength(1);
      expect(tasks[0]).toEqual({
        id: valueTaskInitial.id,
        title: valueTaskInitial.title,
        description: valueTaskInitial.description,
        status: valueTaskInitial.status,
        createdAt: valueTaskInitial.createdAt,
        updatedAt: valueTaskInitial.updatedAt,
      });
    });
  });
});
