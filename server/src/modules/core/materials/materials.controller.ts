import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
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
import {FileInterceptor} from '@nestjs/platform-express';

@Roles(EUserRole.ADMIN, EUserRole.TEACHER)
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get('/')
  @SerializePaginatedResponse(MaterialDto)
  list(@Query() query: ListMaterialsQuery, @CurrentUser() user: UserDocument) {
    return this.materialsService.list(query, user);
  }
  @Get('/:id')
  @SerializeResponse(MaterialDto)
  async getEnglishMaterialById(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument
  ) {
    return this.materialsService.getMaterialById(id, user);
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
  @SerializeResponse(MaterialDto)
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Only JPEG and PNG files are allowed'),
            false
          );
        }
      },
      limits: {fileSize: 10 * 1024 * 1024}
    })
  )
  async generateEnglishStoryMaterial(
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: CreateEnglishMaterialDto,
    @CurrentUser() user: UserDocument
  ) {
    if (!image) {
      throw new BadRequestException('Image file is required');
    }
    return this.materialsService.generateEnglishStoryMaterial(dto, image, user);
  }
}
