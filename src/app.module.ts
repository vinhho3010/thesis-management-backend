 
import { ChatModule } from './modules/chat/chat.module';
import { CouncilModule } from './modules/council/council.module';
import { MailSenderModule } from './modules/mail-sender/mailsender.module';
import { PostModule } from './modules/post/classPost.module';
import { PendingClassModule } from './modules/pending-class/pending-class.module';
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
    ChatModule,
    CouncilModule,
    MailSenderModule,
    PostModule,
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
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthMiddleware)
  //     .exclude(
  //       { path: 'api/thesis*', method: RequestMethod.GET },
  //       { path: 'api/login*', method: RequestMethod.ALL },
  //       { path: 'api/majors', method: RequestMethod.GET }
  //     )
  //     .forRoutes(
  //       {path: 'api/topic*', method: RequestMethod.ALL},
  //       {path: 'api/milestone*', method: RequestMethod.ALL},
  //       {path: 'api/comment*', method: RequestMethod.ALL},
  //       { path: 'api/thesis*', method: RequestMethod.POST },
  //       { path: 'api/thesis*', method: RequestMethod.PUT },
  //       { path: 'api/thesis*', method: RequestMethod.DELETE },
  //       {path: 'api/class*', method: RequestMethod.ALL},
  //       {path: 'api/user*', method: RequestMethod.ALL},
  //       {path: 'api/council*', method: RequestMethod.ALL},
  //       {path: 'api/post*', method: RequestMethod.ALL},
  //       {path: 'api/pending-class*', method: RequestMethod.ALL},
  //       {path: 'api/thesis-version*', method: RequestMethod.ALL},
  //       {path: 'api/mail-sender*', method: RequestMethod.ALL},
  //       {path: 'api/docs*', method: RequestMethod.ALL},
  //       {path: 'api/chat*', method: RequestMethod.ALL},
  //     );
  // }
}
