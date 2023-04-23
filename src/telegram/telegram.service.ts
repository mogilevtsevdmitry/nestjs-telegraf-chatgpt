import { ChatgptService } from '@/chatgpt/chatgpt.service';
import { TelegrafExceptionFilter } from '@/common/telegraf-exception.filter';
import { HttpService } from '@nestjs/axios';
import { UseFilters } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { Observable, filter, map, mergeMap, tap } from 'rxjs';
import { Scenes, Telegraf } from 'telegraf';
import { VoiceService } from './../voice/voice.service';

interface TelegramMesage {
    message: {
        voice: {
            duration: number;
            mime_type: string;
            file_id: string;
            file_unique_id: string;
            file_size: number;
        };
    };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context extends Scenes.SceneContext {}

@Update()
@UseFilters(TelegrafExceptionFilter)
export class TelegramService extends Telegraf {
    private _token: string;
    constructor(
        private readonly gpt: ChatgptService,
        private readonly voiceService: VoiceService,
        private readonly config: ConfigService,
        private readonly httpService: HttpService,
    ) {
        super(config.get('TELEGRAM_BOT_TOKEN'));
        this._token = config.get('TELEGRAM_BOT_TOKEN');
    }

    @Start()
    async onStart(@Ctx() ctx: Context) {
        await ctx.reply('Привет в чате с ChatGPT!');
    }

    @On('text')
    onMessage(@Message('text') text: string) {
        return this.gpt.generateResponse(text);
    }

    @On('voice')
    async onVoiceMessage(@Ctx() ctx: Context) {
        const buffer = await this.fileFromTelegram((ctx as TelegramMesage).message.voice.file_id);
        return buffer.pipe(
            mergeMap((data) => this.voiceService.deepgram(data, ctx.message.from.language_code)),
            mergeMap((text) => this.gpt.generateResponse(text)),
        );
    }

    private async fileFromTelegram(fileId: string): Promise<Observable<Buffer>> {
        const { file_path } = await this.telegram.getFile(fileId);
        const url = `https://api.telegram.org/file/bot${this._token}/${file_path}`;

        return this.httpService.get(url, { responseType: 'arraybuffer' }).pipe(
            filter((data) => !!data?.data),
            map(({ data }) => Buffer.from(data)),
        );
    }
}
