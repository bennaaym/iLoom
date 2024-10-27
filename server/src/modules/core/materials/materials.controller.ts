import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {MaterialsService} from './materials.service';
import {
  CreateEnglishMaterialDto,
  ListMaterialsQuery,
  MaterialDto
} from './dtos';
import {
  CurrentUser,
  Roles,
  SerializePaginatedResponse,
  SerializeResponse
} from '@common/decorators';
import {EUserRole} from '@common/types';
import {UserDocument} from '../users/user.schema';

@Roles(EUserRole.ADMIN, EUserRole.TEACHER)
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get('/')
  @SerializePaginatedResponse(MaterialDto)
  list(@Query() query: ListMaterialsQuery, @CurrentUser() user: UserDocument) {
    return this.materialsService.list(query, user);
  }

  @Post('/english')
  @SerializeResponse(MaterialDto)
  generateEnglishMaterials(
    @Body() dto: CreateEnglishMaterialDto,
    @CurrentUser() user: UserDocument
  ) {
    return this.materialsService.generateEnglishMaterial(dto, user);
  }
}
