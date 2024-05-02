import { ServerErrorException } from './server-error.exception';

// import { BadRequestException } from '@nestjs/common';

/**
 * Every error is a class that is derived from HttpException
 * @param errorName The name of the exception
 * @param value The value to pass into the error constructor
 */
export function exceptionHandler(error: Error) {
  const exceptionsList = [
    'CompanyNotFoundException',
    'InternNotFoundException',
    'ServerErrorException',
    'InternAlreadyExistsException',
    'CompanyAlreadyExistsException',
    'RelationNotFoundException',
    'WrongCredentialsException',
  ];

  const { name, message } = error;

  if (exceptionsList.indexOf(name) === -1) {
    throw new ServerErrorException(message);
  }

  throw error;
}
