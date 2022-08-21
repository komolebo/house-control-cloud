import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
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
import * as moment from "moment";
import {ActivateAccountDto, CheckEmailActivationDto} from "./dto/tokenActivationDto";
import {UserRegistrationDto} from "../users/dto/userLoginDto";

const RESET_TOKEN_EXP = [10, "m"]
enum ESignOption {
    login,
    register,
    forgot
}

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

    async signUser(user: Users, signOption: ESignOption) {
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

        switch (signOption) {
            case ESignOption.forgot:
                await auth.setDataValue("token", token);
                await auth.setDataValue("token_expire",
                    moment().add(...RESET_TOKEN_EXP).toString())
                break;
            case ESignOption.login:
                await auth.setDataValue("token", null);
                await auth.setDataValue("token_expire", null);
                break;
            case ESignOption.register:
                await auth.setDataValue("token", token);
                await auth.setDataValue("token_expire", null);
                break;
            default: break
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
            throw new HttpException("User does not exist", HttpStatus.FOUND);
        }
        if (!user.auth || !user.auth.activated) {
            throw new HttpException("Account not activated", HttpStatus.AMBIGUOUS)
        }

        const passwordMatch = await this.comparePassword(pass, user.password);
        if (!passwordMatch) {
            throw new HttpException("Wrong password", HttpStatus.FORBIDDEN)
        }

        const { token, userInfo } = await this.signUser(user, ESignOption.login)

        await this.historyService.createHistoryItem(user.id, {
            type: THistoryMsgType.Account,
            text: "Signed in"
        })

        return { user: userInfo, token: token, status: HttpStatus.ACCEPTED };
    }

    public async register(user: UserRegistrationDto) {
        console.log(user.password)
        const pass = await this.hashPassword(user.password);

        const newUser = await this.userRepository.create({ ...user, password: pass});

        const { token } = await this.signUser(newUser, ESignOption.register)

        await this.mailService.sendUserAccountActivation(user.full_name, user.email, token)

        await this.historyService.createHistoryItem(newUser.id, {
            type: THistoryMsgType.Account,
            text: "Created account in HomeNET [not activated yet]"
        })
        // return the user and the token
        return { msg: "account created, please activate it in email" };
    }

    public async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const user = await this.userRepository.findOne({
            where: {email: forgotPasswordDto.email},
            include: Auth
        });
        if (!user) {
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND)
        }

        const {token} = await this.signUser(user, ESignOption.forgot)

        await this.mailService.sendUserRestorePassword(user.full_name, user.email, token)
    }

    public async changePassword(resetPasswordDto: ChangePasswordDto) {
        let auth = await this.authRepository.findOne({
            where: {token: resetPasswordDto.token},
            include: [Users]
        })
        if (!auth || !auth.user) {
            return new HttpException('Incorrect token', HttpStatus.FORBIDDEN)
        }
        if (!await this.isTokenNotExpired(auth)) {
            return new HttpException('Token expired', HttpStatus.FORBIDDEN)
        }

        const password = await this.hashPassword(resetPasswordDto.password);
        auth.user.setDataValue('password', password)
        auth.setDataValue('token', null)
        auth.setDataValue('token_expire', null)
        // consider changing account as activation too
        auth.setDataValue('activated', true)
        await auth.user.save()
        await auth.save()

        const token = await this.generateToken(auth.user["dataValues"]);

        return { token: token, status: HttpStatus.ACCEPTED };
    }

    public async isTokenValid(tokenPasswordDto: TokenPasswordDto) {
        const auth = await this.authRepository.findOne({
            where: {token: tokenPasswordDto.token},
            include: [Users]
        });

        const tokenValid = this.isTokenNotExpired(auth)
        if (auth && !tokenValid) {
            auth.setDataValue("token", null)
            auth.setDataValue("token_expire", null)
            await auth.save()
        }
        return tokenValid
    }

    public async isActivationPending(checkEmailActivationDto: CheckEmailActivationDto) {
        const user = await this.userRepository.findOne({
            where: {email: checkEmailActivationDto.email},
            include: Auth
        })

        return user && (!user.auth || user.auth && !user.auth.activated)
    }

    public async activateAccount(activateAccountDto: ActivateAccountDto) {
        const auth = await this.authRepository.findOne({
            where: {token: activateAccountDto.token},
            include: [Users]
        })
        if(!auth || !auth.user) {
            return new HttpException ("Invalid user data", HttpStatus.AMBIGUOUS);
        }
        auth.setDataValue("token", null);
        auth.setDataValue("activated", true);
        await auth.save()

        const {password, ...userInfo} = auth.user["dataValues"]

        return {token: activateAccountDto.token, userInfo}
    }

    public async resendEmail(checkEmailActivationDto: CheckEmailActivationDto) {
        const user = await this.userRepository.findOne({
            where: {email: checkEmailActivationDto.email},
            include: Auth
        })

        const activationPending = user && (!user.auth || user.auth && !user.auth.activated);

        if( !activationPending ) {
            return new HttpException("This email does not need activation", HttpStatus.BAD_REQUEST)
        }

        await this.mailService.sendUserAccountActivation(user.full_name, user.email, user.auth.token)
    }

    private async generateToken(payload, options?: SignOptions) {
        return this.jwtService.signAsync (payload, options);
    }

    private async hashPassword(password: string) {
        return bcrypt.hash (password, 10);
    }

    private async comparePassword(enteredPassword, dbPassword) {
        return bcrypt.compare (enteredPassword, dbPassword);
    }

    private async isTokenNotExpired(auth: Auth) {
        if (!auth) { return false }

        const now = moment()
        const expire_at = moment(auth.token_expire)
        return now.isBefore(expire_at)
    }

    parseHeaders(authorization): Users | null {
        if (!authorization) return null;
        const [, token] =authorization.split ("Bearer ")
        const decodeData = this.jwtService.decode(token);
        return JSON.parse (JSON.stringify (decodeData));
    }
}