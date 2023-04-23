import { ChatGPTModule } from '@/chatgpt/chatgpt.module';
import { VoiceModule } from '@/voice/voice.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from './telegram-config.factory';
import { TelegramService } from './telegram.service';

@Module({
    imports: [TelegrafModule.forRootAsync(options()), ChatGPTModule, VoiceModule, HttpModule],
    providers: [TelegramService],
})
export class TelegramModule {}
