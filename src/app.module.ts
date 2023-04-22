import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatGPTModule } from './chatgpt/chatgpt.module';
import { TelegrafModule } from './telegraf/telegraf.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), TelegrafModule, ChatGPTModule],
})
export class AppModule {}
