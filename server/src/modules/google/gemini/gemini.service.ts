import {ConfigService} from '@modules/config';
import {Injectable} from '@nestjs/common';
import {
  FunctionDeclarationSchema,
  GenerativeModel,
  GoogleGenerativeAI
} from '@google/generative-ai';
import {GoogleAIFileManager} from '@google/generative-ai/server';
import axios from 'axios';
import * as fs from 'fs';

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

  async analyzeImage<T>(
    imageUrl: string,
    prompt: string,
    schema: FunctionDeclarationSchema
  ) {
    const fileManager = new GoogleAIFileManager(this.configService.gemini.key);
    const localImagePath = './temp_image.png';
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream'
    });
    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(localImagePath);
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const uploadResult = await fileManager.uploadFile(localImagePath, {
      mimeType: 'image/png',
      displayName: 'Jetpack drawing'
    });

    const fileData = {
      fileUri: uploadResult.file.uri,
      mimeType: uploadResult.file.mimeType
    };

    fs.unlinkSync(localImagePath);
    const result = await this.model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{text: prompt}, {fileData}]
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
