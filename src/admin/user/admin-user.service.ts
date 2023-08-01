import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { User } from 'src/entities/user.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { Repository } from 'typeorm';
import { UpdateAdminUserDto } from './dto/update-user.dto';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUsersList(query: PaginateQuery): Promise<Paginated<User>> {
    const paginateConfig: PaginateConfig<User> = {
      defaultLimit: 50,
      sortableColumns: ['id'],
      relations: [],
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['name', 'email'],
      select: [
        'id',
        'name',
        'email',
        'isActive',
        'role',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'emailVerifiedAt',
      ],
      filterableColumns: { isActive: [FilterOperator.EQ] },
    };
    const qb = this.userRepository.createQueryBuilder('users');
    return await paginate<User>(query, qb, paginateConfig);
  }

  async updateUser(userId: number, updateUserDto: UpdateAdminUserDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!userId || !user) {
      throw new BadRequestException(returnMessages.UserNotFound);
    }

    user.isActive = updateUserDto.isActive;
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }
}
