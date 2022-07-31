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

type UInfoMap = {
    [uId: number]: Array<string>
}
@WebSocketGateway (3002, {
    cors: {origin: '*',},
    transports: ['polling']
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

    afterInit(server: Server) {
        this.logger.error ('Init');
    }

    handleDisconnect(client: Socket) {
        this.logger.error (`Client disconnected: ${client.id}`);
        const uInfo = this.authService.parseHeaders(client.handshake.headers.authorization);
        if(uInfo) {
            this.logger.warn(`Removing user ${uInfo.full_name} with ID: ${uInfo.id}`)
            this.uMap[uInfo.id] = this.uMap[uInfo.id].filter(el => el !== client.id)
        }
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.error (`Client connected: ${client.id}`);
        const uInfo = this.authService.parseHeaders(client.handshake.headers.authorization);
        if (uInfo) {
            if (Object.keys(this.uMap).findIndex(dId => dId === uInfo.id.toString()) < 0)
                this.uMap[uInfo.id] = []
            this.uMap[uInfo.id].push(client.id);

            this.logger.warn(`Adding user ${uInfo.full_name} and clientId: ${client.id}, arr len now: ${this.uMap[uInfo.id].length}`)
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