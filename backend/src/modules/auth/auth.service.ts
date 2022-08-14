import {HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {Users} from "../users/user.entity";
import {HistoryService} from "../history/history.service";
import {THistoryMsgType} from "../history/dto/history_dto";
import {InjectModel} from "@nestjs/sequelize";
import {Op} from "sequelize";
import {MailService} from "../mail/mail.service";
import {ForgotPasswordDto} from "./dto/forgotPassword_Dto";
import {ChangePasswordDto} from "./dto/changePasswordDto";
import {TokenPasswordDto} from "./dto/tokenPasswordDto";
import { SignOptions } from 'jsonwebtoken';
import {Auth} from "./auth.entity";

@Injectable()
export class AuthService {
    constructor(@InjectModel(Users) private userRepository: typeof Users,
                @InjectModel(Auth) private authRepository: typeof Auth,
                private readonly jwtService: JwtService,
                private readonly historyService: HistoryService,
                private mailService: MailService
    ) { }

    async validateUser(email: string, password: string) {
        // find if user exist with this email
        return null;
    }

    async signUser(user: Users, save_token?: boolean) {
        const token = await this.generateToken(
            {
                id: user.id,
                name: user.full_name,
                email: user.email
            }, {expiresIn: '1d'}
        );

        let auth = user.auth;
        if (!auth) {
            auth = await this.authRepository.create();
            await user.$set("auth", auth);
        }

        if (save_token) {
            await auth.setDataValue("reset_token", token);
        } else {
            await auth.setDataValue("reset_token", null);
            await auth.setDataValue("reset_token_expire", null);
        }
        await auth.save()

        const { password, ...userInfo } = user["dataValues"];
        return { token, userInfo }
    }

    public async login(login: string, pass: string) {
        const user = await this.userRepository.findOne({
            where: {
                [Op.or]: [{email: login}, {login: login}]
            },
            include: Auth
        })
        if (!user) {
            return new UnauthorizedException({message: 'User not exist'})
        }

        const passwordMatch = await this.comparePassword(pass, user.password);
        if (!passwordMatch) {
            return new UnauthorizedException({message: 'Wrong password'})
        }

        const { token, userInfo } = await this.signUser(user)

        await this.historyService.createHistoryItem(user.id, {
            type: THistoryMsgType[THistoryMsgType.Account],
            text: "Signed in"
        })

        return { user: userInfo, token: token, status: HttpStatus.ACCEPTED };
    }

    public async create(user) {
        // hash the password
        const pass = await this.hashPassword(user.password);

        // create the user
        const newUser = await this.userRepository.create({ ...user, password: pass});

        const { token, userInfo } = await this.signUser(user)

        await this.historyService.createHistoryItem(newUser.id, {
            type: THistoryMsgType[THistoryMsgType.Account],
            text: "Successfully registered in HomeNET"
        })
        // return the user and the token
        return { user: userInfo, token };
    }

    public async forgot(forgotPasswordDto: ForgotPasswordDto) {
        const user = await this.userRepository.findOne({
            where: {email: forgotPasswordDto.email},
            include: Auth
        });
        if (!user) {
            return new UnauthorizedException({message: 'User does not exist'})
        }

        const {token} = await this.signUser(user, true)

        // await this.mailService.sendUserRestorePassword(
        //     user.full_name,
        //     user.email,
        //     token
        // )
    }

    public async changePassword(resetPasswordDto: ChangePasswordDto) {
        let auth = await this.authRepository.findOne({
            where: {reset_token: resetPasswordDto.token},
            include: [Users]
        })
        if (!auth || !auth.user) {
            return new UnauthorizedException({message: 'Incorrect token'})
        }

        const password = await this.hashPassword(resetPasswordDto.password);
        auth.user.setDataValue('password', password)
        auth.setDataValue('reset_token', null)
        auth.setDataValue('reset_token_expire', null)
        await auth.user.save()

        const token = await this.generateToken(auth.user["dataValues"]);

        return { token: token, status: HttpStatus.ACCEPTED };
    }

    public async isTokenValid(tokenPasswordDto: TokenPasswordDto) {
        let tokenValid = true;
        let auth = await this.authRepository.findOne({
            where: {reset_token: tokenPasswordDto.token},
            include: [Users]
        });
        // TODO: check expire date
        if (!auth) {
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