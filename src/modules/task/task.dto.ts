import { IsIn, IsString, MinLength } from 'class-validator';
import { TaskStatus } from 'src/domain/entity/Task';

export class TaskCreateDto {
  @IsString({ message: 'Título Obrigatório' })
  title: string;

  @MinLength(10, { message: 'Descrição deve ter pelo menos 10 caracteres' })
  description: string;
}

export class TaskUpdateDto extends TaskCreateDto {
  @IsString({ message: 'ID Obrigatório' })
  id: string;
}

export class TaskChangeStatusDto {
  @IsString({ message: 'ID Obrigatório' })
  id: string;

  @IsString({ message: 'Status Obrigatório' })
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
