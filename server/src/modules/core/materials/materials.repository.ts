import {BaseRepository} from '@modules/database';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Material, MaterialDocument} from './material.schema';

@Injectable()
export class MaterialsRepository extends BaseRepository<MaterialDocument> {
  constructor(
    @InjectModel(Material.name)
    readonly modelRef: Model<MaterialDocument>
  ) {
    super(modelRef);
  }
}
