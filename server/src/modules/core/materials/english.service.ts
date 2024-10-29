import {Injectable} from '@nestjs/common';
import {GeminiService} from '@modules/google';
import {EMaterialActivity, EnglishLevel, ReadingActivity} from './types';
import {englishPrompts} from './prompts';
import {MaterialDocument} from './material.schema';

@Injectable()
export class EnglishService {
  constructor(private readonly geminiService: GeminiService) {}

  private readingToHtml = (material: MaterialDocument) => {
    const content = material.content as ReadingActivity;
    return `
      <h3>${content.title}</h3>
      <p>${content.text}</p>
    `;
  };

  toHtml(material: MaterialDocument) {
    switch (material.activity) {
      case EMaterialActivity.READING:
        return this.readingToHtml(material);
      default:
        return '';
    }
  }

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
