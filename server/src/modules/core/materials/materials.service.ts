import {Injectable} from '@nestjs/common';
import {EnglishService} from './english.service';
import {CreateEnglishMaterialDto} from './dtos';
import {UserDocument} from '../users/user.schema';
import {EMaterialActivity, EMaterialScope, EMaterialSubject} from './types';
import {MaterialsRepository} from './materials.repository';
import {ExplicityAny} from '@common/types';

@Injectable()
export class MaterialsService {
  constructor(
    private readonly englishService: EnglishService,
    private readonly repository: MaterialsRepository
  ) {}

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
