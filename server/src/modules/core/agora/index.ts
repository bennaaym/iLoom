import { Module } from '@nestjs/common';
import { AgoraService } from './agora.service';
import { AgoraController } from './agora.controller';
import { ConfigModule } from '@modules/config';

@Module({
  imports: [ConfigModule],
  providers: [AgoraService],
  controllers: [AgoraController],
})
export class AgoraModule {}
