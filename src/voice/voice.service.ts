import { Deepgram } from '@deepgram/sdk';
import { PrerecordedTranscriptionResponse } from '@deepgram/sdk/dist/types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VoiceService {
    private readonly logger = new Logger(VoiceService.name);

    constructor(private readonly config: ConfigService) {}
    async deepgram(file: Buffer, lang = 'ru') {
        const deepgram = new Deepgram(this.config.get('DEEPGRAM_KEY'));

        const text = await deepgram.transcription
            .preRecorded(
                {
                    buffer: file,
                    mimetype: 'audio/ogg',
                },
                {
                    language: lang,
                    punctuate: true,
                },
            )
            .catch((err) => {
                this.logger.error(err);
                return null;
            });
        if (!text) {
            return 'Возникла ошибка';
        }
        return (text as PrerecordedTranscriptionResponse).results.channels[0].alternatives[0].transcript;
    }
}
