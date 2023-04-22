import { ChatgptService } from '@/chatgpt/chatgpt.service';
import { TelegrafExceptionFilter } from '@/common/telegraf-exception.filter';
import { UseFilters } from '@nestjs/common';
import { Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context extends Scenes.SceneContext {}

@Update()
@UseFilters(TelegrafExceptionFilter)
export class TelegramService {
    constructor(private readonly gpt: ChatgptService) {}

    @Start()
    async start(@Ctx() ctx: Context) {
        await ctx.reply('Привет в чате с ChatGPT!');
    }

    @On('text')
    onMessage(@Message('text') text: string) {
        return this.gpt.generateResponse(text);
    }
}
