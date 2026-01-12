import { IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { TaskStatus } from 'src/domain/entity/Task';

export class TaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Título é obrigatório' })
  title: string;

  @IsString()
  @MinLength(10, { message: 'A descrição precisa de 10 caracteres' })
  description: string;
}

export class TaskChangeStatusDto {
  @IsString({ message: 'ID Obrigatório' }) @IsString({ message: 'Status Obrigatório' })
  @IsIn([TaskStatus.PENDING, TaskStatus.PROGRESS, TaskStatus.COMPLETED], {
    message: 'Status inválido',
  })
  status: TaskStatus;
}

export type TaskOutputDto = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
};

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}
