import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import {EnglishService} from './english.service';
import {CreateEnglishMaterialDto, ListMaterialsQuery} from './dtos';
import {UserDocument} from '../users/user.schema';
import {EMaterialActivity, EMaterialScope, EMaterialSubject} from './types';
import {MaterialsRepository} from './materials.repository';
import {ExplicityAny} from '@common/types';
import {lodash} from '@libs';
import {StorageService} from '@modules/google';
import {PdfService} from '@modules/pdf';
import {MaterialDocument} from './material.schema';
import {CreateAlgorithmMaterialDto} from './dtos/create-algorithm-material.dto copy';
import {AlgorithmService} from './algorithm.service';
import * as fs from 'fs';
import path from 'path';

@Injectable()
export class MaterialsService {
  constructor(
    private readonly englishService: EnglishService,
    private readonly algorithmService: AlgorithmService,
    private readonly repository: MaterialsRepository,
    private readonly storageService: StorageService,
    private readonly pdfService: PdfService
  ) {}

  private buildListFilter(query: ListMaterialsQuery, user: UserDocument) {
    const queryFilter = lodash.pick(query, ['classroom']);
    return {
      $or: [{classroom: queryFilter.classroom}, {scope: EMaterialScope.GLOBAL}],
      user: user.id
    };
  }

  private async upload(material: MaterialDocument) {
    let toHtml: (html: MaterialDocument) => string;

    switch (material.subject) {
      case EMaterialSubject.ENGLISH:
        toHtml = this.englishService.toHtml.bind(this.englishService);
        break;
      case EMaterialSubject.COMPUTER_SCIENCE:
        toHtml = this.algorithmService.toHtml.bind(this.algorithmService);
        break;
      default:
        throw new Error(`Invalid material subject: ${material.subject}`);
    }

    const pdfBuffer = await this.pdfService.htmlToPdf(toHtml(material));
    return this.storageService.upload({
      fileBuffer: pdfBuffer,
      path: `materials/${material.id}`,
      fileType: 'application/pdf'
    });
  }

  private async replacePlaceholders(
    promptTemplate: string,
    replacements: Record<string, any>
  ) {
    return Object.keys(replacements).reduce((acc, key) => {
      const placeholder = new RegExp(`\\\${${key}}`, 'g');
      return acc.replace(placeholder, replacements[key]);
    }, promptTemplate);
  }

  private async loadPromptTemplate(filename: string): Promise<string> {
    const filePath = path.join(__dirname, 'prompts/prompt-template', filename);
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async list(query: ListMaterialsQuery, user: UserDocument) {
    const pageOptions = lodash.pick(query, ['page', 'perPage']);
    return this.repository.paginate({
      filter: this.buildListFilter(query, user),
      orderBy: {createdAt: -1, updatedAt: -1},
      pageOptions
    });
  }

  async retrieve(id: string, user: UserDocument) {
    const material = await this.repository.findById(id);
    if (!material) throw new NotFoundException();
    if (material.user !== user.id) throw new ForbiddenException();
    return material;
  }

  async generateEnglishStoryMaterial(
    dto: CreateEnglishMaterialDto,
    image: Express.Multer.File,
    user: UserDocument
  ) {
    const imageUrl = await this.storageService.upload({
      fileBuffer: image.buffer,
      path: `images/${Date.now()}_${image.originalname}`,
      fileType: image.mimetype
    });

    const promptTemplate = await this.loadPromptTemplate(
      'lesson.english.story.txt'
    );

    const prompt = await this.replacePlaceholders(promptTemplate, {
      level: dto.level,
      ageGroup: dto.ageGroup,
      description: dto.description,
      numberOfWords: dto.numberOfWords
    });

    const content = await this.englishService.generateStoryFromImage({
      prompt,
      imageUrl
    });

    const material = await this.repository.create({
      user: user.id,
      classroom: dto.classroom,
      scope: dto.classroom ? EMaterialScope.CLASSROOM : EMaterialScope.GLOBAL,
      subject: EMaterialSubject.ENGLISH,
      activity: EMaterialActivity.STORY,
      content,
      imageUrl
    });

    const contentPdf = await this.upload(material);
    return this.repository.update(material.id, {contentPdf});
  }

  async generateEnglishMaterial(
    dto: CreateEnglishMaterialDto,
    user: UserDocument
  ) {
    let promise: Promise<Record<string, ExplicityAny>>;

    switch (dto.activity) {
      case EMaterialActivity.READING:
        const promptTemplate = await this.loadPromptTemplate(
          'lesson.english.article.txt'
        );
        const prompt = await this.replacePlaceholders(promptTemplate, {
          level: dto.level,
          ageGroup: dto.ageGroup,
          description: dto.description,
          numberOfWords: dto.numberOfWords
        });
        promise = this.englishService.generateReading(prompt);
        break;
      case EMaterialActivity.SPEAKING:
        promise = this.englishService.generateSpeaking();
        break;
      case EMaterialActivity.WRITING:
        promise = this.englishService.generateWriting();
        break;
      default:
        throw new Error(`Invalid material activity: ${dto.activity}`);
    }

    const content = await promise;
    const material = await this.repository.create({
      user: user.id,
      classroom: dto.classroom,
      scope: dto.classroom ? EMaterialScope.CLASSROOM : EMaterialScope.GLOBAL,
      subject: EMaterialSubject.ENGLISH,
      activity: dto.activity,
      content
    });
    const contentPdf = await this.upload(material);
    return this.repository.update(material.id, {contentPdf});
  }

  async generateAlgorithmMaterial(
    dto: CreateAlgorithmMaterialDto,
    user: UserDocument
  ) {
    let promise: Promise<Record<string, ExplicityAny>>;

    switch (dto.activity) {
      case EMaterialActivity.ALGORITHM:
        const promptTemplate = await this.loadPromptTemplate(
          'lesson.algorithm.txt'
        );
        const prompt = await this.replacePlaceholders(promptTemplate, {
          level: dto.level,
          topic: dto.topic,
          description: dto.description
        });
        promise = this.algorithmService.generateProblem(prompt);
        break;
      default:
        throw new Error(`Invalid material activity: ${dto.activity}`);
    }

    const content = await promise;
    const material = await this.repository.create({
      user: user.id,
      classroom: dto.classroom,
      scope: dto.classroom ? EMaterialScope.CLASSROOM : EMaterialScope.GLOBAL,
      subject: EMaterialSubject.COMPUTER_SCIENCE,
      activity: dto.activity,
      content
    });
    const contentPdf = await this.upload(material);
    return this.repository.update(material.id, {contentPdf});
  }
}
