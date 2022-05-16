import { Injectable, Inject } from '@nestjs/common';
import { Users } from './user.entity';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../core/constants/index1';
import {isNumber} from "class-validator";

@Injectable()
export class UsersService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof Users) { }

    async create(user: UserDto): Promise<Users> {
        return await this.userRepository.create<Users>(user);
    }

    async getUsers(): Promise<Users[]> {
        return await this.userRepository.findAll();
    }

    async deleteUser(user: UserDto): Promise<number> {
        return await this.userRepository.destroy<Users>({ where: { email : user.email } });
    }

    async deleteUserById(userId: number): Promise<number> {
        return await this.userRepository.destroy<Users>({where: { id : userId }})
    }

    async findOneByEmail(email: string): Promise<Users> {
        return await this.userRepository.findOne<Users>({ where: { email } });
    }

    async findOneById(id: number): Promise<Users> {
        return await this.userRepository.findOne<Users>({ where: { id } });
    }
}