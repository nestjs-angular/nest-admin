import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import { AbstractService } from '../common/abstract.service';
import { PaginatedResult } from '../common/paginated-result.interface';

@Injectable()
export class UserService extends AbstractService{
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super(userRepository)
    }

    async paginate(page: number = 1, relations: any[] = [] ): Promise<PaginatedResult> {
        const { data, meta } = await super.paginate(page, relations);
        return {
            data,
            meta
        }
    }
}
