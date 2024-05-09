import {Injectable, Logger} from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {Server, Socket} from 'socket.io';
import {AuthService} from "../modules/auth/auth.service";
import {Users} from "../modules/users/user.entity";

type UInfoMap = {
    [uId: number]: Array<string>
}
@WebSocketGateway (3002, {
    cors: {origin: '*',},
    transports: ['websocket']
})
@Injectable ()
export class SocketService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private authService: AuthService) {}

    @WebSocketServer () server: Server;
    private logger: Logger = new Logger ('SocketService');
    private uMap: UInfoMap = {}

    @SubscribeMessage ('message')
    handleMessage(client: Socket, payload: string): void {
        this.logger.error ('handleMessage');
        this.server.emit ('msgToClient', payload);
    }

    @SubscribeMessage ('authenticate')
    handleRegistrationMessage(client: Socket, payload: string): void {
        this.logger.log (`Client '${client.id}' asks for registration`);
        const uInfo = this.authService.parseHeaders(payload["Authorization"]);
        if (uInfo) {
            this.registerUser (uInfo, client);
        }
    }

    afterInit(server: Server) {
        this.logger.log('Service initialized successfully');
    }

    handleDisconnect(client: Socket) {
        this.logger.debug(`Client disconnected: ${client.id}`);
        const uInfo = this.authService.parseHeaders(client.handshake.headers.authorization);
        if(uInfo) {
            this.logger.log(`Removing user ${uInfo["name"]} with ID: ${uInfo.id}`)
            this.uMap[uInfo.id] = this.uMap[uInfo.id].filter(el => el !== client.id)
        }
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log (`Client connected: ${client.id}`)
        const uInfo = this.authService.parseHeaders(client.handshake.headers.authorization);
        if (uInfo) {
            this.registerUser (uInfo, client);
        }
    }

    private registerUser(uInfo: Users, client) {
        if (Object.keys (this.uMap).findIndex (dId => dId === uInfo.id.toString ()) < 0) {
            this.uMap[uInfo.id] = []
        }
        this.uMap[uInfo.id].push (client.id);

        this.logger.log (`Adding user '${uInfo["name"]}' with clientId: ${client.id}, sockets opened: ${this.uMap[uInfo.id].length}`)
    }

    dispatchMsg(userId: number, topic: string, data: any = {}) {
        if (Object.keys(this.uMap).findIndex(dId => dId === userId.toString()) >= 0) {
            this.logger.log(`Dispatching '${topic}' to userId=${userId} and clientId array=${this.uMap[userId]}`)
            this.uMap[userId].forEach(clientId => {
                this.server.to(clientId).emit(topic, data);
            })
        }
    }

    dispatchNotificationMsg(userIdList: number[]) {
        userIdList.forEach(userId => this.dispatchMsg(userId, "notification"))
    }

    dispatchDevUpdateMsg(userIdList: number[]) {
        userIdList.forEach(userId => this.dispatchMsg(userId, "dev_update"))
    }
}