import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../core/constants/index1';
import {isNumber} from "class-validator";

@Injectable()
export class UsersService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User) { }

    async create(user: UserDto): Promise<User> {
        return await this.userRepository.create<User>(user);
    }

    async getUsers(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    async deleteUser(user: UserDto): Promise<number> {
        return await this.userRepository.destroy<User>({ where: { email : user.email } });
    }

    async deleteUserById(userId: number): Promise<number> {
        return await this.userRepository.destroy<User>({where: { id : userId }})
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { email } });
    }

    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { id } });
    }
}