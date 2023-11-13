
import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('api/notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) {}

    @Get('/user/:userId')
    async getAllNotificationByUserId(
        @Param('userId') userId: string
    ) {
        return await this.notificationService.getAllNotificationByUserId(userId);
    }

    @Delete('/user/:userId')
    async deleteAllNotificationByUserId(
        @Param('userId') userId: string
    ) {
        return await this.notificationService.deleteAllNotificationByUserId(userId);
    }

    @Patch('/user/:userId/mark-all-as-read')
    async markAllAsRead(
        @Param('userId') userId: string
    ) {
        return await this.notificationService.markAllAsRead(userId);
    }

    @Patch(':id')
    async newNotification(
        @Param('id') id: string,
        @Body() notification: any
    ) {
        return await this.notificationService.updateNotification(id, notification);
    }

    @Delete(':id')
    async deleteNotification(
        @Param('id') id: string
    ) {
        return await this.notificationService.deleteNotification(id);
    }
}
