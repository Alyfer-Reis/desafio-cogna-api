import User from '../entity/User';

export interface UserRepositoryInterface {
  create(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
