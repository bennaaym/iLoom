import { Controller, Get, Query } from '@nestjs/common';
import { AgoraService } from './agora.service';
import { RtcRole } from 'agora-access-token';

@Controller('agora')
export class AgoraController {
  constructor(private readonly agoraService: AgoraService) {}

  @Get('token')
  getToken(
    @Query('channelName') channelName: string,
    @Query('uid') uid: string,
    @Query('role') role: string
  ) {
    const userRole =
      role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const expireTimeInSeconds = 3600;

    const token = this.agoraService.generateToken(
      channelName,
      uid,
      userRole,
      expireTimeInSeconds
    );

    return { token };
  }
}
