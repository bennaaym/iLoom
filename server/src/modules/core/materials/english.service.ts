import {Injectable} from '@nestjs/common';
import {GeminiService} from '@modules/google';
import {EnglishLevel, ReadingActivity} from './types';
import {englishPrompts} from './prompts';

@Injectable()
export class EnglishService {
  constructor(private readonly geminiService: GeminiService) {}

  async generateReading({level}: {level: EnglishLevel}) {
    return await this.geminiService.generateJSON<ReadingActivity>(
      englishPrompts.reading.prompt({level}),
      englishPrompts.reading.schema
    );
  }
  generateSpeaking() {
    return Promise.resolve({text: ''});
  }
  generateWriting() {
    return Promise.resolve({text: ''});
  }
}
