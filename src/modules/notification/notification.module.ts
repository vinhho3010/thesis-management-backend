import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Module } from '@nestjs/common';
import { Notification, NotificationSchema } from 'src/schemas/notification.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Notification.name, schema: NotificationSchema}])
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
    exports: [NotificationService]
})
export class NotificationModule {}
