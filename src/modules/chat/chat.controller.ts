import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('api/chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get('/user/:id')
    async getChat(@Param('id') id: string) {
        return this.chatService.getChatOfUser(id);
    }

    @Get('/room/user/:Id1/user2/:Id2')
    async getChatOf2User(@Param('Id1') id1: string, @Param('Id2') id2: string) {
        return this.chatService.getChatOf2User(id1, id2);
    }

    @Post('/room')
    async createChatRoom(@Body() users: any) {
        return this.chatService.createChatRoom(users);
    }

    @Get('/room/:id')
    async getChatDetail(@Param('id') id: string) {
        return this.chatService.getChatMessages(id);
    }
}
