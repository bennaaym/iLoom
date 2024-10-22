import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UserRepository) {}

  async isEmailTaken(email: string) {
    return Boolean(await this.repository.findOne({ email }));
  }

  findByIdentifier(identifier: 'id' | 'email', value: string) {
    if (identifier === 'id') return this.repository.findById(value);
    return this.repository.findOne({ [identifier]: value });
  }

  create(dto: Partial<UserDocument>) {
    return this.repository.create(dto);
  }
}
