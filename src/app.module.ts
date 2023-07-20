import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AdminWorkspaceModule } from './admin/admin-main.module';
import { MainModule } from './app/main.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: parseInt(process.env.DATABASE_PORT),
      entities: ['./dist/entities/*.entity.js'],
      synchronize: true,
      migrations: ['./dist/migration/*.js'],
      autoLoadEntities: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAILER_HOST,
        port: +process.env.MAILER_PORT,
        ignoreTLS: process.env.MAILER_IGNORE_TLS === 'true',
        secure: process.env.MAILER_SECURE === 'true',
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS,
        },
      },
      template: {
        dir: join(process.cwd(), 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AuthModule,
    EventEmitterModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
    }),
    MainModule,
    AdminWorkspaceModule,
  ],
})
export class AppModule {}
