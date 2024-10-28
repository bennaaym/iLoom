import {Module} from '@nestjs/common';
import {GeminiService} from './gemini/gemini.service';
import {StorageService} from './storage/storage.service';

@Module({
  providers: [GeminiService, StorageService],
  exports: [GeminiService, StorageService]
})
export class GoogleModule {}

export {GeminiService} from './gemini/gemini.service';
export {StorageService} from './storage/storage.service';
