import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { ChatgptService } from '../chatgpt/chatgpt.service';

@Injectable()
export class TelegrafService implements OnModuleInit {
    private readonly logger = new Logger(TelegrafService.name);
    private bot: Telegraf;

    constructor(private configService: ConfigService, private chatGPTService: ChatgptService) {
        const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
        this.bot = new Telegraf(botToken);
    }

    async onModuleInit() {
        this.initializeBot();
        await this.bot.launch();
        console.log('Telegraf bot has been started.');
    }

    private initializeBot() {
        this.bot.start((ctx) => ctx.reply('Привет! Я чат-бот на NestJS!'));

        this.bot.on('text', async (ctx) => {
            const inputMessage = ctx.message.text;
            this.logger.debug({ inputMessage });
            // const userId = ctx.from.id;
            this.chatGPTService.generateResponse(inputMessage).subscribe((res) => ctx.reply(res)); // userId
        });

        this.bot.catch((err, ctx) => {
            console.error(`Ooops, encountered an error for ${ctx.updateType}`, err);
        });
    }
}
