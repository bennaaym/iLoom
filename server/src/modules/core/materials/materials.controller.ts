import {BadRequestException, Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors} from '@nestjs/common';
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
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post('/english/story')
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ['image/jpeg', 'image/png'];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Only JPEG and PNG files are allowed'), false);
      }
    },
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  @SerializeResponse(MaterialDto)
  async generateEnglishStoryMaterial(
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: CreateEnglishMaterialDto,
    @CurrentUser() user: UserDocument,
  ) {
    if (!image) {
      throw new BadRequestException('Image file is required');
    }
    console.log(dto)

    return this.materialsService.generateEnglishStoryMaterial(dto, image, user);
  }
}
