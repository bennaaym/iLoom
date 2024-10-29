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

@Injectable()
export class MaterialsService {
  constructor(
    private readonly englishService: EnglishService,
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
    if (material) throw new NotFoundException();
    if (material.user !== user.id) throw new ForbiddenException();
    return material;
  }

  async generateEnglishMaterial(
    dto: CreateEnglishMaterialDto,
    user: UserDocument
  ) {
    let promise: Promise<Record<string, ExplicityAny>>;

    switch (dto.activity) {
      case EMaterialActivity.READING:
        promise = this.englishService.generateReading({level: dto.level});
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
}
