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
import {Users} from "../modules/users/user.entity";
import {JwtService} from "@nestjs/jwt";

type UInfoMap = {
    [uId: number]: Array<string>
}

const A : UInfoMap = {
    1: ["aa", "b"],
    2: ["aa", "b"],
    3: ["aa", "b"],
}

@WebSocketGateway (3002, {
    cors: {origin: '*',},
    transports: ['polling']
})
@Injectable ()
export class SocketService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private jwtService: JwtService) {}

    @WebSocketServer () server: Server;
    private logger: Logger = new Logger ('SocketService');
    private uMap: UInfoMap = {}

    private parseHeaders(header) {
        let userInfo: Users | null;
        if(header) {
            const token = header.split(' ')[1]
            const decodeData = this.jwtService.decode(token);
            userInfo = JSON.parse (JSON.stringify(decodeData));
        }
        return userInfo;
    }

    @SubscribeMessage ('message')
    handleMessage(client: Socket, payload: string): void {
        this.logger.error ('handleMessage');
        this.server.emit ('msgToClient', payload);
    }

    afterInit(server: Server) {
        this.logger.error ('Init');
    }

    handleDisconnect(client: Socket) {
        this.logger.error (`Client disconnected: ${client.id}`);
        const uInfo = this.parseHeaders(client.handshake.headers.authorization);
        if(uInfo) {
            this.logger.warn(`Removing user ${uInfo.name} with ID: ${uInfo.id}`)
            this.uMap[uInfo.id] = this.uMap[uInfo.id].filter(el => el !== client.id)
        }
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.error (`Client connected: ${client.id}`);
        const uInfo = this.parseHeaders(client.handshake.headers.authorization);
        if (uInfo) {
            if (Object.keys(this.uMap).findIndex(dId => dId === uInfo.id.toString()) < 0)
                this.uMap[uInfo.id] = []
            this.uMap[uInfo.id].push(client.id);

            this.logger.warn(`Adding user ${uInfo.name} and clientId: ${client.id}, arr len now: ${this.uMap[uInfo.id].length}`)
        }
    }

    dispatchMsg(userId: number, topic: string, data: any = {}) {
        if (Object.keys(this.uMap).findIndex(dId => dId === userId.toString()) >= 0) {
            this.logger.warn(`Dispatching to userId=${userId} and clientId array=${this.uMap[userId]}`)
            this.uMap[userId].forEach(clientId => {
                this.server.to(clientId).emit(topic, data);
            })
        }
    }

    dispatchNotificationMsg(userId: number) {
        this.dispatchMsg(userId, "notification")
    }

    dispatchDevUpdateMsg(userId: number) {
        this.dispatchMsg(userId, "dev_update")
    }
}