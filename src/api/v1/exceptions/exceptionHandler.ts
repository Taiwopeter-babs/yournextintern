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

  const exceptionMessage = `${message} ${value}`;

  switch (name) {
    case 'CompanyNotFoundException':
      throw new CompanyNotFoundException(exceptionMessage);

    case 'InternNotFoundException':
      throw new InternNotFoundException(exceptionMessage);

    case 'InternAlreadyExistsException':
      throw new InternAlreadyExistsException(exceptionMessage);

    case 'CompanyAlreadyExistsException':
      throw new CompanyAlreadyExistsException(exceptionMessage);

    case 'ServerErrorException':
      throw new ServerErrorException(exceptionMessage);

    default:
      throw new ServerErrorException(exceptionMessage);
  }
}
