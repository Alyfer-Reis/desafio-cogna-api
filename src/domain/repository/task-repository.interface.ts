import { Task } from '../entity/Task';

export interface TaskRepositoryInterface {
  create(task: Task): Promise<void>;
  findById(id: string, userId: string): Promise<Task | null>;
  findAllByUserId(userId: string): Promise<Task[]>;
  update(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
}
