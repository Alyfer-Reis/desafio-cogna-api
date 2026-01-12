import { Task } from 'src/domain/entity/Task';
import { TaskRepositoryInterface } from 'src/domain/repository/task-repository.interface';

export default class TaskRepositoryMemory implements TaskRepositoryInterface {
  private tasks: Task[] = [];

  async create(task: Task): Promise<void> {
    this.tasks.push(task);
    return Promise.resolve();
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    const task = this.tasks.find((t) => t.id === id && t.userId === userId);
    return Promise.resolve(task || null);
  }

  async findAllByUserId(userId: string): Promise<Task[]> {
    const userTasks = this.tasks.filter((task) => task.userId === userId);
    return Promise.resolve(userTasks);
  }

  async update(task: Task): Promise<void> {
    const index = this.tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
    }
    return Promise.resolve();
  }

  async delete(id: string): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return Promise.resolve();
  }
}
