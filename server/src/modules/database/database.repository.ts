import {PaginatedResults} from '@common/dtos';
import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery
} from 'mongoose';

export abstract class BaseRepository<T> {
  constructor(private readonly baseModel: Model<T>) {}

  get model() {
    return this.baseModel;
  }

  findMany(
    filter?: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T> & {lean: boolean}
  ) {
    return this.baseModel.find(filter, projection, {...options}).exec();
  }

  findById(
    id: string,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>
  ): Promise<T | undefined> {
    return this.baseModel.findById(id, projection, options).exec();
  }

  findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>
  ): Promise<T> {
    return this.baseModel.findOne(filter, projection, options).exec();
  }

  createMany(args: Partial<T>[]) {
    return this.baseModel.insertMany(args, {ordered: false});
  }

  async create(args: Partial<T>): Promise<T> {
    const doc = new this.baseModel(args);
    await doc.save();
    return doc;
  }

  updateMany(filter: UpdateQuery<T>, update: UpdateQuery<T>) {
    return this.baseModel.updateMany(filter, update);
  }

  update(
    id: string,
    updateDto: UpdateQuery<T>,
    options?: {
      canCreate?: boolean;
    }
  ): Promise<T> {
    return this.baseModel
      .findByIdAndUpdate(id, updateDto, {
        new: true,
        upsert: options?.canCreate
      })
      .exec();
  }

  deleteMany(filter: FilterQuery<T>) {
    return this.baseModel.deleteMany(filter).exec();
  }

  delete(filter: FilterQuery<T>) {
    return this.baseModel.deleteOne(filter).exec();
  }

  count(filter?: FilterQuery<T>) {
    return this.baseModel.countDocuments(filter).exec();
  }

  async paginate({
    filter,
    orderBy,
    pageOptions
  }: {
    filter?: FilterQuery<T>;
    orderBy?: Record<string, -1 | 1>;
    pageOptions?: {
      page?: number;
      perPage?: number;
    };
  }): Promise<PaginatedResults<T>> {
    const page = Number(pageOptions?.page || 1);
    const perPage = Number(pageOptions?.perPage || 30);
    const skip = page > 0 ? perPage * (page - 1) : 0;

    const [total, data] = await Promise.all([
      this.count(filter),
      this.baseModel.find(filter).sort(orderBy).skip(skip).limit(perPage)
    ]);

    return {
      data,
      meta: {
        perPage,
        page,
        total,
        pages: Math.ceil(total / perPage)
      }
    };
  }
}
