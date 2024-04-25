import { ServerErrorException } from './server-error.exception';
import {
  CompanyNotFoundException,
  InternNotFoundException,
} from './not-found.exception';
import {
  CompanyAlreadyExistsException,
  InternAlreadyExistsException,
} from './already-exists.exception';

type TError = string | number;

/**
 * Every error is a class that is derived from HttpException
 * @param errorName The name of the exception
 * @param value The value to pass into the error constructor
 */
export function exceptionHandler(error: Error, value: TError = '') {
  const exceptionsList = [
    'CompanyNotFoundException',
    'InternNotFoundException',
    'ServerErrorException',
    'InternAlreadyExistsException',
    'CompanyAlreadyExistsException',
  ];

  const { name, message } = error;

  console.log(name, message, value);

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
    case 'ServerErrorException':
      throw new ServerErrorException(message);
    default:
      throw new ServerErrorException(message);
  }
}
