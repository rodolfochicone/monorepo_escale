import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AxiosError } from 'axios';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const { status, message, error } = this.getErrorInfo(exception);

    const errorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      {
        exception: exception instanceof Error ? exception.stack : exception,
        request: {
          method: request.method,
          url: request.url,
          params: request.params,
          query: request.query,
          body: request.body,
        },
      },
    );

    response.status(status).json(errorResponse);
  }

  private getErrorInfo(exception: unknown): {
    status: number;
    message: string;
    error: string;
  } {
    if (exception instanceof HttpException) {
      return {
        status: exception.getStatus(),
        message: exception.message,
        error: exception.constructor.name.replace('Exception', ''),
      };
    }

    if (this.isAxiosError(exception)) {
      return this.handleAxiosError(exception);
    }

    if (exception instanceof Error) {
      return this.handleGenericError(exception);
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
      error: 'Internal Server Error',
    };
  }

  private isAxiosError(exception: unknown): exception is AxiosError {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'isAxiosError' in exception
    );
  }

  private handleAxiosError(error: AxiosError): {
    status: number;
    message: string;
    error: string;
  } {
    if (error.response?.status === 404) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Recurso não encontrado na PokéAPI',
        error: 'Not Found',
      };
    }

    if (error.response?.status === 400) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Dados inválidos fornecidos para a PokéAPI',
        error: 'Bad Request',
      };
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Serviço PokéAPI temporariamente indisponível',
        error: 'Service Unavailable',
      };
    }

    return {
      status: HttpStatus.BAD_GATEWAY,
      message: `Erro de comunicação com PokéAPI: ${error.message}`,
      error: 'Bad Gateway',
    };
  }

  private handleGenericError(error: Error): {
    status: number;
    message: string;
    error: string;
  } {
    if (error.message.includes('não encontrado na PokéAPI')) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: error.message,
        error: 'Not Found',
      };
    }

    if (error.message.includes('already exists')) {
      return {
        status: HttpStatus.CONFLICT,
        message: error.message,
        error: 'Conflict',
      };
    }

    if (error.message.includes('Erro ao buscar dados da PokéAPI')) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `Erro interno: ${error.message}`,
      error: 'Internal Server Error',
    };
  }
}
