import {Module} from '@nestjs/common';
import {MaterialsController} from './materials.controller';
import {MaterialsService} from './materials.service';
import {MongooseModule} from '@nestjs/mongoose';
import {Material, MaterialSchema} from './material.schema';
import {MaterialsRepository} from './materials.repository';
import {GoogleModule} from '@modules/google';
import {EnglishService} from './english.service';
import {PdfModule} from '@modules/pdf';
import { AlgorithmService } from './algorithm.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Material.name, schema: MaterialSchema}]),
    GoogleModule,
    PdfModule
  ],
  controllers: [MaterialsController],
  providers: [MaterialsService, EnglishService, MaterialsRepository, AlgorithmService],
  exports: [MaterialsService]
})
export class MaterialsModule {}
export {MaterialsService} from './materials.service';
