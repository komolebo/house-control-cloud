import socketio from "socket.io-client";
import {createContext} from "react";
import {getAuthToken} from "../globals/storage";

const SOCKET_URL = "ws://127.0.0.1:3002/"

export const socket = socketio(SOCKET_URL, {
    transports: ["websocket"],
    // extraHeaders: { "Authorization": `Bearer ${getAuthToken()}`},
})

socket.on('connect', () => {
    // connection is done, now registering to the socket server
    console.log("Websocket connected")
    socket.emit('authenticate', { "Authorization": `Bearer ${getAuthToken()}`})
})


export const SocketContext = createContext(socket);

export const IO_NOTIFICATION_KEY = "notification"
export const IO_DEV_DATA_CHANGE_KEY = "dev_update"
