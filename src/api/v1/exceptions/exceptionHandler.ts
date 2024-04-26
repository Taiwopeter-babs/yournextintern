import { ServerErrorException } from './server-error.exception';
import {
  CompanyNotFoundException,
  InternNotFoundException,
  RelationNotFoundException,
} from './not-found.exception';
import {
  CompanyAlreadyExistsException,
  InternAlreadyExistsException,
} from './already-exists.exception';
// import { BadRequestException } from '@nestjs/common';

/**
 * Every error is a class that is derived from HttpException
 * @param errorName The name of the exception
 * @param value The value to pass into the error constructor
 */
export function exceptionHandler(error: Error, value: any = '') {
  const exceptionsList = [
    'CompanyNotFoundException',
    'InternNotFoundException',
    'ServerErrorException',
    'InternAlreadyExistsException',
    'CompanyAlreadyExistsException',
    'RelationNotFoundException',
  ];

  const { name, message } = error;

  if (exceptionsList.indexOf(name) === -1) {
    throw new ServerErrorException(message);
  }

  switch (name) {
    case 'CompanyNotFoundException':
      throw new CompanyNotFoundException(value);

    case 'InternNotFoundException':
      throw new InternNotFoundException(value);

    case 'InternAlreadyExistsException':
      throw new InternAlreadyExistsException(value);

    case 'CompanyAlreadyExistsException':
      throw new CompanyAlreadyExistsException(value);

    case 'RelationNotFoundException':
      throw new RelationNotFoundException(value);

    default:
      throw new ServerErrorException(message);
  }
}
