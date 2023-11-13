/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from 'src/schemas/notification.schema';

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
    ) {}

    async getAllNotificationByUserId(userId: string): Promise<Notification[]> {
        try {
            const notifications = await this.notificationModel.find({to: userId}).populate('from', 'fullName avatar role email code createdAt').sort({createdAt: -1});
            return notifications;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteAllNotificationByUserId(userId: string): Promise<any> {
        return await this.notificationModel.deleteMany({to: userId});
    }

    async markAllAsRead(userId: string): Promise<any> {
        return await this.notificationModel.updateMany({to: userId}, {isRead: true});
    }

    async newNotification(notification: Notification): Promise<any> {
        try {
            const newNotification = new this.notificationModel(notification);
            await newNotification.save();
            return newNotification.populate('from', 'fullName avatar role email code createdAt');
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateNotification(id: string, notification: any): Promise<any> {
        try {
            return await this.notificationModel.findByIdAndUpdate(id, notification, {new: true})
        } catch (error) {
            
        }
    }

    async deleteNotification(id: string): Promise<any> {
        return await this.notificationModel.findByIdAndDelete(id);
    }
}
