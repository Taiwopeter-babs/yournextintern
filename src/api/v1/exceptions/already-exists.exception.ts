import { HttpException, HttpStatus } from '@nestjs/common';

class AlreadyExistsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class CompanyAlreadyExistsException extends AlreadyExistsException {
  constructor(companyId: number | string) {
    super(`Company with the id: ${companyId}, already exists`);
  }
}

export class InternAlreadyExistsException extends AlreadyExistsException {
  constructor(internId: number | string) {
    super(`Intern with the id: ${internId}, already exists`);
  }
}
