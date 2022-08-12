import {HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {UserPwdDto} from "../users/dto/user.dto";
import {Users} from "../users/user.entity";
import {HistoryService} from "../history/history.service";
import {THistoryMsgType} from "../history/dto/history_dto";
import {InjectModel} from "@nestjs/sequelize";
import {MailService} from "../mail/mail.service";
import {ForgotPasswordDto} from "./dto/forgotPassword_Dto";
import {ChangePasswordDto} from "./dto/changePasswordDto";
import {TokenPasswordDto} from "./dto/tokenPasswordDto";
import { SignOptions } from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(@InjectModel(Users) private userRepository: typeof Users,
                private readonly jwtService: JwtService,
                private readonly historyService: HistoryService,
                private mailService: MailService
    ) { }

    async validateUser(email: string, password: string) {
        // find if user exist with this email
        return null;
    }

    public async login(login: string, pass: string) {
        console.log("User login", login)

        login = login.toLowerCase()

        let user = await this.userRepository.findOne({where: {login: login}});
        if (!user) {
            user = await this.userRepository.findOne({where: {email: login}})
            if (!user) {
                return new UnauthorizedException({message: 'User not exist'})
            }
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

        await this.historyService.createHistoryItem(user.id, {
            type: THistoryMsgType[THistoryMsgType.Account],
            text: "Signed in"
        })

        return { user: result, token: token, status: HttpStatus.ACCEPTED };
    }

    public async create(user) {
        // hash the password
        const pass = await this.hashPassword(user.password);

        user.email = user.email.toLowerCase()
        user.login = user.login.toLowerCase()

        // create the user
        const newUser = await this.userRepository.create({ ...user, password: pass});

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = newUser['dataValues'];

        // generate token
        const token = await this.generateToken(result);

        await this.historyService.createHistoryItem(newUser.id, {
            type: THistoryMsgType[THistoryMsgType.Account],
            text: "Successfully registered in HomeNET"
        })
        // return the user and the token
        return { user: result, token };
    }

    public async forgot(forgotPasswordDto: ForgotPasswordDto) {
        let user = await this.userRepository.findOne({where: {email: forgotPasswordDto.email}});
        if (!user) {
            return new UnauthorizedException({message: 'User does not exist'})
        }

        const token = await this.generateToken(
            {
                id: user.id,
                name: user.full_name,
                email: user.email
            },
            {expiresIn: '1d'});
        user.setDataValue("reset_token", token);
        await user.save()

        await this.mailService.sendUserRestorePassword(
            user.full_name,
            user.email,
            token
        )
    }

    public async changePassword(resetPasswordDto: ChangePasswordDto) {
        let user = await this.userRepository.findOne({where: {reset_token: resetPasswordDto.token}});
        if (!user) {
            return new UnauthorizedException({message: 'Incorrect token'})
        }

        const password = await this.hashPassword(resetPasswordDto.password);
        user.setDataValue('password', password)
        user.setDataValue('reset_token', null)
        await user.save()

        const token = await this.generateToken(user["dataValues"]);

        return { token: token, status: HttpStatus.ACCEPTED };
    }

    public async isTokenValid(tokenPasswordDto: TokenPasswordDto) {
        let tokenValid = true;
        let user = await this.userRepository.findOne({where: {reset_token: tokenPasswordDto.token}});
        if (!user) {
            tokenValid = false;
        }
        return {"valid": tokenValid}
    }

    private async generateToken(payload, options?: SignOptions) {
        return this.jwtService.signAsync (payload, options);
    }

    private async hashPassword(password) {
        return bcrypt.hash (password, 10);
    }

    private async comparePassword(enteredPassword, dbPassword) {
        return bcrypt.compare (enteredPassword, dbPassword);
    }

    parseHeaders(authorization): Users | null {
        if (!authorization) return null;
        const [, token] =authorization.split ("Bearer ")
        const decodeData = this.jwtService.decode(token);
        return JSON.parse (JSON.stringify (decodeData));
    }
}