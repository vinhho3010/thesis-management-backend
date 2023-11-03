import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from 'src/schemas/chat.schema';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
        @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}

    async getChatOfUser(id: string) {
        try {
            //don't return mesages of chat
            const chatList = await this.chatModel
              .find({ participants: { $in: [id] } }, { messages: false })
              .populate('participants', 'fullName avatar role email code');
            return chatList;
        } catch (error) {
            throw new HttpException('Không tìm thấy danh sách tin', 404)
        }
    }

    async getChatDetail(id: string) {
        const chat = await this.chatModel.findById(id).populate('participants', 'fullName avatar role email code').populate('messages');
        return chat;
    }

    async getChatOf2User(id1: string, id2: string) {
        const chat = await this.chatModel.findOne({participants: {$all: [id1, id2]}}).populate('participants', 'fullName avatar role email code').populate('messages');
        if(chat) {
            return chat;
        } else {
            this.chatModel.create({participants: [id1, id2], messages: []});
            return this.chatModel.findOne({participants: {$all: [id1, id2]}}).populate('participants', 'fullName avatar role email code').populate('messages');
        }
    }

    async sendMessage(message: Message) {
        //find chat of users unless create new chat
        const chat = await this.chatModel.findOne({participants: {$all: [message.from, message.to]}});
        const newMessage = new this.messageModel(message);
        newMessage.save();
        if (chat) {
            chat.messages.push(newMessage);
            chat.save();
        } else {
            const newChat = new this.chatModel({participants: [message.from, message.to], messages: [newMessage]});
            newChat.save();    
        }
        return await newMessage.populate('from', 'fullName avatar role email code createdAt');
    }

    async createChatRoom(users: any[]) {
        const chat = await this.chatModel.findOne({participants: {$all: users}}).populate('participants', 'fullName avatar role email code').populate('messages');
        if (chat) {
            return chat;
        } else {
            const newChat = new this.chatModel({participants: users, messages: []});
            newChat.save();
            return newChat.populate('participants', 'fullName avatar role email code');
        }
    }

    async getChatMessages(id: string) {
        const chat = await this.chatModel.findById(id).populate('participants', 'fullName avatar role email code').populate({
            path: 'messages',
            populate: {
                path: 'from',
                select: 'fullName avatar role email code createdAt'
            }
        });
        if(chat) {
            return chat;
        } else {
            throw new HttpException('Không tìm thấy tin nhắn', 404)
        }
    }
    
}
