import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { log } from 'console';
import { Message } from 'src/schemas/message.schema';
import { ChatService } from './chat.service';
import { Notification } from 'src/schemas/notification.schema';
import { NotificationService } from '../notification/notification.service';


@WebSocketGateway({cors: {origin: '*'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private userToSocketMap: any[] = []
    constructor(private chatService: ChatService, private notificationService: NotificationService) {}

    @WebSocketServer()
    server: any;

    @SubscribeMessage('sendMessage')
    async handleEvent(@MessageBody() message: Message) {
        const storedMessage = await this.chatService.sendMessage(message);
        const connectedClient = this.userToSocketMap.find((item) => item.userId === message.to);
        if (connectedClient) {
            this.server.to(connectedClient.socketId).emit('newMessage', storedMessage);
            log(`Message sent to ${message.to}`);
        }
    }

    @SubscribeMessage('sendNotification')
    async handleNotification(@MessageBody() notification: Notification) {
        log(notification);
        const storedNotification = await this.notificationService.newNotification(notification);
        const connectedClient = this.userToSocketMap.find((item) => item.userId === notification.to);
        if (connectedClient) {
            this.server.to(connectedClient.socketId).emit('newNotification', storedNotification);
            log(`Notification sent to ${notification.to}`);
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
