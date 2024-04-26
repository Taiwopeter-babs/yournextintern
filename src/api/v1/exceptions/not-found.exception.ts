import { HttpException, HttpStatus } from '@nestjs/common';

class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class CompanyNotFoundException extends NotFoundException {
  constructor(companyId: number | string) {
    super(`Company with the id: ${companyId}, was not found`);
  }
}

export class InternNotFoundException extends NotFoundException {
  constructor(internId: number | string) {
    super(`Intern with the id: ${internId}, was not found`);
  }
}

export class RelationNotFoundException extends NotFoundException {
  constructor(data: { internId: number | string; companyId: number | string }) {
    super(
      `Intern with the id: ${data.internId}, is not linked to Company with the id: ${data.companyId}`,
    );
  }
}
