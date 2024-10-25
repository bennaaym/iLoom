import {Module} from '@nestjs/common';
import {LiveblocksService} from './liveblocks.service';

@Module({
  providers: [LiveblocksService],
  exports: [LiveblocksService]
})
export class LiveblocksModule {}
export {LiveblocksService} from './liveblocks.service';
