import * as cookie from 'cookie';
import cookieParser from 'cookie-parser';
import {UserSession} from '@common/types';
import {UserDocument} from '@modules/core/users/user.schema';
import {SessionsService} from '@modules/sessions';
import {UsersService} from '@modules/core/users';
import {ConfigService} from '@modules/config';
import {Socket} from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    currentUser: UserDocument;
    classroom: string;
  }
}

interface SocketAuthContext {
  readonly socket: Socket;
  readonly sessionsService: SessionsService;
  readonly usersService: UsersService;
  readonly configService: ConfigService;
}

export const socketAuth = async ({
  socket,
  sessionsService,
  usersService,
  configService
}: SocketAuthContext) => {
  try {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) throw new Error();

    const parsedCookies = cookie.parse(cookies);
    const signedSessionId = parsedCookies['connect.sid'];

    const sessionId = cookieParser.signedCookie(
      signedSessionId,
      configService.sessionSecret
    );

    if (!sessionId) throw new Error();

    const session = await sessionsService.getSession(sessionId);

    if (!session) throw new Error();

    const {userId} = JSON.parse(session.session) as UserSession;

    const user = await usersService.findByIdentifier('id', userId);

    if (!user) throw new Error();

    socket.currentUser = user;
    socket.classroom = socket.handshake.query.classroom as string;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    console.error(err);
    socket.disconnect();
  }
};
