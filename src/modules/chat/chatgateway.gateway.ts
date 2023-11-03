import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { log } from 'console';
import { Message } from 'src/schemas/message.schema';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';


@WebSocketGateway({cors: {origin: '*'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private userToSocketMap: any[] = []
    constructor(private chatService: ChatService, private jwtService: JwtService,) {}

    @WebSocketServer()
    server: any;

    @SubscribeMessage('sendMessage')
    async handleEvent(@MessageBody() message: Message) {
        const storedMessage = await this.chatService.sendMessage(message);
        const connectedClient = this.userToSocketMap.find((item) => item.userId === message.to);
        log(message)
        if (connectedClient) {

            this.server.to(connectedClient.socketId).emit('newMessage', storedMessage);
            log(`Message sent to ${message.to}`);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleConnection(client: any, ..._args: any[]) {
        const userId = client.handshake.query.userId;
        if(userId) {
            this.userToSocketMap.push({userId, socketId: client.id});
        }
        log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: any) {
        this.userToSocketMap = this.userToSocketMap.filter((item) => item.socketId !== client.id);
        console.log(`Client disconnected: ${client.id}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    afterInit(server: any) {
        console.log('Socket is live')
    }
}
