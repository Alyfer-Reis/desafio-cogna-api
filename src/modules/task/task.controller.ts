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
  TaskDto,
  TaskOutputDto
} from './task.dto';
import { TaskService } from './task.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() taskDto: TaskDto,
  ) {
    await this.taskService.create(req.user.id, taskDto);
  }

  @Put(':id')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() taskDto: TaskDto,
  ) {
    return await this.taskService.update(req.user.id, id, taskDto);
  }

  @Put('/status/:id')
  async changeStatus(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() taskChangeStatusDto: TaskChangeStatusDto,
  ) {
    return await this.taskService.changeStatus(
      req.user.id,
      id,
      taskChangeStatusDto,
    );
  }

  @Get()
  async getAll(@Request() req: AuthenticatedRequest): Promise<TaskOutputDto[]> {
    return await this.taskService.getAll(req.user.id);
  }

  @Get(':id')
  async findById(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<TaskOutputDto> {
    return await this.taskService.findById(req.user.id, id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.taskService.delete(id);
  }
}
