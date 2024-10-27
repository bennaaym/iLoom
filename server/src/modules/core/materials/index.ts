import {Module} from '@nestjs/common';
import {MaterialsController} from './materials.controller';
import {MaterialsService} from './materials.service';
import {MongooseModule} from '@nestjs/mongoose';
import {Material, MaterialSchema} from './materila.schema';
import {MaterialsRepository} from './materials.repository';
import {GoogleModule} from '@modules/google';
import {EnglishService} from './english.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Material.name, schema: MaterialSchema}]),
    GoogleModule
  ],
  controllers: [MaterialsController],
  providers: [MaterialsService, EnglishService, MaterialsRepository]
})
export class MaterialsModule {}
