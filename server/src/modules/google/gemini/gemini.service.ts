import {ConfigService} from '@modules/config';
import {Injectable} from '@nestjs/common';
import {
  FunctionDeclarationSchema,
  GenerativeModel,
  GoogleGenerativeAI
} from '@google/generative-ai';
import {lodash} from '@libs';

@Injectable()
export class GeminiService {
  private readonly model: GenerativeModel;

  constructor(private readonly configService: ConfigService) {
    const genAI = new GoogleGenerativeAI(this.configService.gemini.key);
    this.model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash'
    });
  }

  async generateText(prompt: string) {
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  async generateJSON<T>(prompt: string, schema: FunctionDeclarationSchema) {
    const result = await this.model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{text: prompt}]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });

    return JSON.parse(result.response.text()) as T;
  }
}
