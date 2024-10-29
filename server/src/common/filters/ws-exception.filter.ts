import {Catch, WsExceptionFilter, ArgumentsHost, Logger} from '@nestjs/common';
import {WsException} from '@nestjs/websockets';

@Catch(WsException)
export class WebSocketExceptionFilter implements WsExceptionFilter {
  private readonly logger = new Logger(WebSocketExceptionFilter.name);

  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const data = host.switchToWs().getData();
    const error = exception.getError();

    //TODO: Add fine grind error handlingww
    this.logger.error(`WebSocket error: ${error}`);
    client.emit('error', {message: error, data});
  }
}
