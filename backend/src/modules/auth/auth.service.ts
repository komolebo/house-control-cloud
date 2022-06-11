import {Injectable, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {createEvalAwarePartialHost} from "ts-node/dist/repl";
import {UserDto, UserPwdDto} from "../users/dto/user.dto";
import {Users} from "../users/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string) {
        // find if user exist with this email
        return null;
    }

    public async login(email: string, pass: string) {
        let user = await this.userService.findOneByEmail(email);
        if (!user) {
            return new UnauthorizedException({message: 'User not exist'})
        }

        // find if user password match
        const match = await this.comparePassword(pass, user.password);
        if (!match) {
            return new UnauthorizedException({message: 'Wrong password'})
        }

        user = user["dataValues"]

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = user;
        const token = await this.generateToken(user);

        return { user: result, token: token };
    }

    public async create(user) {
        // hash the password
        const pass = await this.hashPassword(user.password);

        // create the user
        const newUser = await this.userService.create({ ...user, password: pass });

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = newUser['dataValues'];

        // generate token
        const token = await this.generateToken(result);

        // return the user and the token
        return { user: result, token };
    }

    public async updatePwd(userId: number, pass: UserPwdDto) {
        const user : Users = await this.userService.findOneById(userId);
        const hash_pass: string = await this.hashPassword(pass.password);

        await user.setDataValue('password', hash_pass);
        await user.save();
        return user;
    }

    private async generateToken(user) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }

    private async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }
}