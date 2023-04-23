import { SpeechClient } from '@google-cloud/speech';
import { google } from '@google-cloud/speech/build/protos/protos';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

enum Lang {
    ru = 'ru-RU',
    en = 'en-US',
}

@Injectable()
export class VoiceService {
    private readonly logger = new Logger(VoiceService.name);
    private speechClient: SpeechClient;

    constructor() {
        this.speechClient = new SpeechClient({
            projectId: 'chatgpt-bot-384612',
        });
    }

    async voiceToText(file: Buffer, lang = 'ru'): Promise<string> {
        const audioBytes = file.toString('base64');

        const audio = {
            content: audioBytes,
        };

        const request: google.cloud.speech.v1.IRecognizeRequest = {
            audio: audio,
            config: {
                encoding: 'OGG_OPUS',
                languageCode: Lang[lang],
                sampleRateHertz: 48000,
            },
        };

        const [response] = await this.speechClient.recognize(request).catch((err) => {
            this.logger.error(err);
            return [null];
        });
        if (!response) {
            throw new BadRequestException();
        }
        console.log({ response: JSON.stringify(response, null, 2) });

        const transcription = response.results.map((result) => result.alternatives[0].transcript).join('\n');
        console.log({ transcription });

        return transcription;
    }
}
