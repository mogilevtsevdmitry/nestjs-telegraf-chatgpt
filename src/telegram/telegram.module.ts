import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from './telegram-config.factory';
import { TelegramService } from './telegram.service';
import { ChatGPTModule } from '@/chatgpt/chatgpt.module';

@Module({
    imports: [TelegrafModule.forRootAsync(options()), ChatGPTModule],
    providers: [TelegramService],
})
export class TelegramModule {}
