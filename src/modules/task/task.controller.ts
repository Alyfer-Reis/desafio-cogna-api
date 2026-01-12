import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/infra/auth/jwt-auth.guard';
import type {
  AuthenticatedRequest,
  TaskChangeStatusDto,
  TaskCreateDto,
  TaskOutputDto,
  TaskUpdateDto,
} from './task.dto';
import { TaskService } from './task.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() taskDto: TaskCreateDto,
  ) {
    await this.taskService.create(req.user.id, taskDto);
  }

  @Put()
  async update(
    @Request() req: AuthenticatedRequest,
    @Body() taskDto: TaskUpdateDto,
  ) {
    return await this.taskService.update(req.user.id, taskDto);
  }

  @Put('/status')
  async changeStatus(
    @Request() req: AuthenticatedRequest,
    @Body() taskChangeStatusDto: TaskChangeStatusDto,
  ) {
    return await this.taskService.changeStatus(
      req.user.id,
      taskChangeStatusDto,
    );
  }

  @Get()
  async getAll(@Request() req: AuthenticatedRequest): Promise<TaskOutputDto[]> {
    return await this.taskService.getAll(req.user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.taskService.delete(id);
  }
}
