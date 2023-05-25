import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./Auth/auth.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MailerModule } from "@nestjs-modules/mailer";
import * as process from "process";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: parseInt(process.env.DATABASE_PORT),
      entities: ["./dist/entities/*.entity.js"],
      synchronize: true,
      migrations: ["./dist/migration/*.js"],
      autoLoadEntities: true
    }),
    MailerModule.forRoot({
        transport: {
          host: process.evn.MAILER_HOST,
          port: +process.evn.MAILER_PORT,
          ignoreTLS: process.evn.MAILER_IGNORE_TLS === "true",
          secure: process.evn.MAILER_SECURE === "true",
          auth: {
            user: process.evn.MAILER_USER,
            pass: process.evn.MAILER_PASS
          }
        }
        template: {
          dir: process.cwd() + "//templates",
          adapter: new HandlebarsAdapter(),
          options: {
            secret: true
          }
        }
      }
    )
    AuthModule, EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
