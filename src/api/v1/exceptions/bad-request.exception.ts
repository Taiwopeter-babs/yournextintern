import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class CompanyAlreadyExistsException extends BadRequestException {
  constructor(companyId: number | string) {
    super(`Company with the id: ${companyId}, already exists`);
  }
}

export class InternAlreadyExistsException extends BadRequestException {
  constructor(internId: number | string) {
    super(`Intern with the id: ${internId}, already exists`);
  }
}

export class WrongCredentialsException extends BadRequestException {
  constructor() {
    super('Wrong credentials provided');
  }
}
