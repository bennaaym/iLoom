import { Injectable } from '@nestjs/common';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { ConfigService } from '@modules/config'; 

type RtcRoleType = typeof RtcRole[keyof typeof RtcRole];

// export enum RtcRole {
//     PUBLISHER = 1,
//     SUBSCRIBER = 2,
//   }

@Injectable()
export class AgoraService {
  private appID: string;
  private appCertificate: string;

  constructor(private readonly configService: ConfigService) {
    this.appID = this.configService.agora.appID;
    this.appCertificate = this.configService.agora.appCertificate;
  }

  generateToken(
    channelName: string,
    uid: number,
    role: RtcRoleType,
    expireTimeInSeconds: number
  ): string {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expireTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      this.appID,
      this.appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    return token;
  }
}
