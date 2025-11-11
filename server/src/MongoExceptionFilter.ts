import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    // map common mongoose/mongo errors
    if (exception?.code === 11000) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ statusCode: 409, message: `Duplicate key: ${exception.keyValue.name} already exists`, error: 'Conflict' });
    }
    if (exception?.name === 'ValidationError') {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          statusCode: 400,
          message: exception.message,
          error: 'Bad Request',
        });
    }
    if (exception?.name === 'CastError') {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          statusCode: 400,
          message: 'Invalid id format',
          error: 'Bad Request',
        });
    }
    // If it's already an HttpException, rethrow/format it
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      return res.status(status).json(payload);
    }

    // fallback
    console.error('Unhandled exception:', exception);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ statusCode: 500, message: 'Internal server error' });
  }
}
