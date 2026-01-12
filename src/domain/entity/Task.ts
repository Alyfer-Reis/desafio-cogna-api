import { IsDate, IsIn, IsString, IsUUID, MinLength } from 'class-validator';
import { randomUUID } from 'crypto';
import { Entity } from './Entity';

export class Task extends Entity {
  private constructor(
    id: string | null,
    readonly userId: string,
    private _title: string,
    private _description: string,
    private _status: TaskStatus,
    readonly createdAt: Date,
    private _updatedAt: Date,
  ) {
    super(id);

    if (this.createdAt > this._updatedAt) {
      throw new Error('createdAt não pode ser maior que updatedAt');
    }
  }

  public update(title: string, description: string) {
    this._title = title;
    this._description = description;
    this._updatedAt = new Date();
  }

  public changeStatus(status: TaskStatus) {
    this._status = status;
    this._updatedAt = new Date();
  }

  static create(props: TaskCreateInput): Task {
    const validator = new TaskCreateInput(props);
    this.validateCreate(validator);

    return new Task(
      randomUUID(),
      props.userId,
      props.title,
      props.description,
      TaskStatus.PENDING,
      new Date(),
      new Date(),
    );
  }

  static reconstruct(props: TaskReconstructInput): Task {
    const validator = new TaskReconstructInput(props);
    this.validateReconstruct(validator);

    return new Task(
      props.id,
      props.userId,
      props.title,
      props.description,
      props.status,
      props.createdAt,
      props.updatedAt,
    );
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get status(): TaskStatus {
    return this._status;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}

export enum TaskStatus {
  PENDING = 'pending',
  PROGRESS = 'progress',
  COMPLETED = 'completed',
}

class TaskCreateInput {
  @IsString({ message: 'ID do Usuário Obrigatório' })
  userId: string;

  @IsString({ message: 'Título Obrigatório' })
  title: string;

  @MinLength(10, { message: 'Descrição deve ter pelo menos 10 caracteres' })
  description: string;

  constructor(props: any) {
    Object.assign(this, props);
  }
}

class TaskReconstructInput extends TaskCreateInput {
  @IsUUID('4', { message: 'ID inválido' })
  id: string;

  @IsIn([TaskStatus.PENDING, TaskStatus.PROGRESS, TaskStatus.COMPLETED], {
    message: 'Status inválido',
  })
  status: TaskStatus;

  @IsDate({ message: 'createdAt deve ser uma data válida' })
  createdAt: Date;

  @IsDate({ message: 'updatedAt deve ser uma data válida' })
  updatedAt: Date;

  constructor(props: any) {
    super(props);
    Object.assign(this, props);
  }
}
