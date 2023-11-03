import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ChatGateway } from './chatgateway.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/schemas/message.schema';
import { Chat, ChatSchema } from 'src/schemas/chat.schema';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string | number>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [
        ChatController, ],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
