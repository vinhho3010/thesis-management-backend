import { PendingClassModule } from './modules/pending-class/pending-class.module';
import { PendingClassModule } from './modules/pending-class.module';
import { MajorModule } from './modules/major/major.module';
import { TopicModule } from './modules/topic/topic.module';
import { ThesisVersionModule } from './modules/thesis-version/thesis-version.module';

import { ThesisModule } from './modules/thesis/thesis.module';
import { MilestoneModule } from './modules/milestone/milestone.module';
import { CommentModule } from './modules/comment/comment.module';
import { ClassModule } from './modules/class/class.module';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DocsModule } from './modules/docs/docs.module';
@Module({
  imports: [
    PendingClassModule,
    PendingClassModule,
    MajorModule,
    MajorModule,
    TopicModule,
    ThesisVersionModule,
    ThesisModule,
    MilestoneModule,
    CommentModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI_CLOUD || 'mongodb://localhost:27017/',
    ),
    AuthModule,
    UserModule,
    DocsModule,
    ClassModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
