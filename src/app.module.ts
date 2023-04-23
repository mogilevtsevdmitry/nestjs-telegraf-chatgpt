import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatGPTModule } from './chatgpt/chatgpt.module';
import { TelegramModule } from './telegram/telegram.module';
import { VoiceModule } from './voice/voice.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), ChatGPTModule, TelegramModule, VoiceModule],
})
export class AppModule {}
