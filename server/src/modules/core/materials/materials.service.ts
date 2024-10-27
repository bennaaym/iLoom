import {Injectable} from '@nestjs/common';
import {EnglishService} from './english.service';
import {CreateEnglishMaterialDto, ListMaterialsQuery} from './dtos';
import {UserDocument} from '../users/user.schema';
import {EMaterialActivity, EMaterialScope, EMaterialSubject} from './types';
import {MaterialsRepository} from './materials.repository';
import {ExplicityAny} from '@common/types';
import {lodash} from '@libs';

@Injectable()
export class MaterialsService {
  constructor(
    private readonly englishService: EnglishService,
    private readonly repository: MaterialsRepository
  ) {}

  private buildListFilter(query: ListMaterialsQuery, user: UserDocument) {
    const queryFilter = lodash.pick(query, ['classroom']);
    return {
      $or: [{classroom: queryFilter.classroom}, {scope: EMaterialScope.GLOBAL}],
      user: user.id
    };
  }

  async list(query: ListMaterialsQuery, user: UserDocument) {
    const pageOptions = lodash.pick(query, ['page', 'perPage']);
    return this.repository.paginate({
      filter: this.buildListFilter(query, user),
      orderBy: {createdAt: -1, updatedAt: -1},
      pageOptions
    });
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

    return this.repository.create({
      user: user.id,
      classroom: dto.classroom,
      scope: dto.classroom ? EMaterialScope.CLASSROOM : EMaterialScope.GLOBAL,
      subject: EMaterialSubject.ENGLISH,
      activity: dto.activity,
      content
    });
  }
}
