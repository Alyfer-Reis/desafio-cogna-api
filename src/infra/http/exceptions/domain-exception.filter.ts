import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  DataIntegrityError,
  FieldError,
  InputValidationError,
} from '../../../domain/error/domain-validation-error';

interface ErrorResponseBody {
  message: string | string[];
  error: string;
  fields?: FieldError[];
}

@Catch(Error)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let body: ErrorResponseBody = {
      message: exception.message,
      error: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const responseError = exception.getResponse() as
        | string
        | { message?: string | string[]; error?: string };

      body = {
        message:
          typeof responseError === 'object'
            ? responseError.message || exception.message
            : responseError,
        error:
          typeof responseError === 'object' && responseError.error
            ? responseError.error
            : 'Bad Request',
      };
    }

    if (exception instanceof InputValidationError) {
      status = HttpStatus.BAD_REQUEST;
      body = {
        message: 'Existem erros de validação nos dados enviados',
        error: 'Bad Request',
        fields: exception.errors,
      };
    }

    if (exception instanceof DataIntegrityError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      body = {
        message: 'Falha de integridade nos dados recuperados do sistema',
        error: 'Internal Server Error',
        fields: exception.errors,
      };
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      ...body,
    });
  }
}
