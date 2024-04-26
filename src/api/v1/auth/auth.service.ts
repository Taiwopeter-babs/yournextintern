import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { exceptionHandler } from '../exceptions/exceptionHandler';

@Injectable()
export class AuthService {
  /** salt rounds to hash password with */
  private saltRounds = 10;

  /**
   * ### verifies a password
   */
  async verifyPassword(password: string, hash: string) {
    try {
      const isVerified = await bcrypt.compare(password, hash);
      return isVerified;
    } catch (error) {
      exceptionHandler(error);
    }
  }

  /**
   * ### hashes a user password
   */
  async hashPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      exceptionHandler(error);
    }
  }
}
