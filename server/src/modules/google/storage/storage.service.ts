import {Injectable, NotFoundException} from '@nestjs/common';
import {Storage} from '@google-cloud/storage';
import {ConfigService} from '@modules/config';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket = 'iloomai';

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({credentials: configService.gcp.credentials});
  }

  private async upsertBucket(bucketName: string) {
    const bucket = this.storage.bucket(bucketName);
    if (!(await bucket.exists()).at(0)) {
      await this.storage.createBucket(bucketName);
    }
    return this.storage.bucket(bucketName);
  }

  getPublicUrl = (path: string) => {
    return `https://storage.googleapis.com/${this.bucket}/${path}`;
  };

  async upload({
    fileBuffer,
    fileType,
    path
  }: {
    fileBuffer: Buffer;
    fileType: string;
    path: string;
  }) {
    const bucket = await this.upsertBucket(this.bucket);
    const file = bucket.file(path);
    await file.save(fileBuffer, {
      metadata: {
        contentType: fileType
      },
      resumable: false
    });
    return this.getPublicUrl(path);
  }

  async download(path: string) {
    try {
      const bucket = this.storage.bucket(this.bucket);
      const file = bucket.file(path);
      const exists = await file.exists();
      if (!exists[0]) throw new Error('File not found');
      return file;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      throw new NotFoundException('File not found');
    }
  }

  async delete(bucketName: string, filename: string) {
    await this.storage.bucket(bucketName).file(filename).delete();
  }
}
