import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, catchError, map, of, tap } from 'rxjs';

interface ChatGptAnswer {
    id: string;
    object: string;
    created: number;
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    choices: {
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
        index: number;
    }[];
}

@Injectable()
export class ChatgptService {
    private readonly logger = new Logger(ChatgptService.name);
    private apiUrl: string;

    constructor(private configService: ConfigService, private httpService: HttpService) {
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    }

    generateResponse(prompt: string): Observable<string> {
        const apiKey = this.configService.get('CHATGPT_API_KEY');
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        };

        const data = {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 1,
        };
        return this.httpService.post<ChatGptAnswer>(this.apiUrl, data, { headers }).pipe(
            // tap(({ data }) => this.logger.log(data)),
            map((data) => data.data?.choices[0].message.content.trim()),
            catchError((err) => {
                this.logger.error(err);
                return of(err);
            }),
        );
    }
}
