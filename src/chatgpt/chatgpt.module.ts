import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';

@Module({
    imports: [HttpModule],
    providers: [ChatgptService],
    exports: [ChatgptService],
})
export class ChatGPTModule {}
