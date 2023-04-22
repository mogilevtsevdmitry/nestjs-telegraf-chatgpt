import { Module } from '@nestjs/common';
import { TelegrafService } from './telegraf.service';
import { ChatGPTModule } from '@/chatgpt/chatgpt.module';

@Module({
    imports: [ChatGPTModule],
    providers: [TelegrafService],
})
export class TelegrafModule {}
