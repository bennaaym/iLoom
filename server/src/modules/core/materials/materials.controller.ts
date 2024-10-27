import {Body, Controller, Post} from '@nestjs/common';
import {MaterialsService} from './materials.service';
import {CreateEnglishMaterialDto, MaterialDto} from './dtos';
import {CurrentUser, Roles, SerializeResponse} from '@common/decorators';
import {EUserRole} from '@common/types';
import {UserDocument} from '../users/user.schema';

@Roles(EUserRole.ADMIN, EUserRole.TEACHER)
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post('/english')
  @SerializeResponse(MaterialDto)
  generateEnglishMaterials(
    @Body() dto: CreateEnglishMaterialDto,
    @CurrentUser() user: UserDocument
  ) {
    return this.materialsService.generateEnglishMaterial(dto, user);
  }
}
