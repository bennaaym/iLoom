import {Module} from '@nestjs/common';
import {GeminiService} from './gemini/gemini.service';

@Module({
  providers: [GeminiService],
  exports: [GeminiService]
})
export class GoogleModule {}

export {GeminiService} from './gemini/gemini.service';
