import {Injectable} from '@nestjs/common';
import {GeminiService} from '@modules/google';
import {EMaterialActivity, AlgorithmLevel, ReadingActivity} from './types';
import {englishPrompts, algorithmPrompts} from './prompts';
import {MaterialDocument} from './material.schema';

@Injectable()
export class AlgorithmService {
  constructor(private readonly geminiService: GeminiService) {}

  private materialToHtml = (material: MaterialDocument) => {
    const content = material.content as ReadingActivity;
    return `
      <h3>${content.title}</h3>
      <p>${content.text}</p>
    `;
  };
  toHtml(material: MaterialDocument) {
    switch (material.activity) {
      case EMaterialActivity.ALGORITHM:
        return this.materialToHtml(material);
      default:
        return '';
    }
  }

  async generateProblem(prompt: string) {
    return await this.geminiService.generateJSON<ReadingActivity>(
      prompt,
      algorithmPrompts.algorithm.schema
    );
  }
}
