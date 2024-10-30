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
      <h3>Questions</h3>
      <div>${content.questions.map((question) => `<p>${question}</p>`).join('')}</div>
    `;
  };
  private storyToHtml = (material: MaterialDocument) => {
    const content = material.content as ReadingActivity;
    return `
      <h3>${content.title}</h3>
      <img src="${material.imageUrl}" alt="Story Image" style="max-width: 100%; height: auto;"/>
      <p>${content.text}</p>
      <h3>Questions</h3>
      <div>${content.questions.map((question) => `<p>${question}</p>`).join('')}</div>
    `;
  };
  toHtml(material: MaterialDocument) {
    switch (material.activity) {
      case EMaterialActivity.READING:
        return this.readingToHtml(material);
      case EMaterialActivity.STORY:
        return this.storyToHtml(material);
      default:
        return '';
    }
  }

  async generateReading({
    level,
    ageGroup,
    description
  }: {
    level: EnglishLevel;
    ageGroup: string;
    description: string;
  }) {
    return await this.geminiService.generateJSON<ReadingActivity>(
      englishPrompts.reading.prompt({level, ageGroup, description}),
      englishPrompts.reading.schema
    );
  }

  async generateStoryFromImage({
    level,
    ageGroup,
    description,
    imageUrl
  }: {
    level: EnglishLevel;
    ageGroup: string;
    description: string;
    imageUrl: string;
  }) {
    return await this.geminiService.generateJSON<ReadingActivity>(
      englishPrompts.story.prompt({level, ageGroup, description, imageUrl}),
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
