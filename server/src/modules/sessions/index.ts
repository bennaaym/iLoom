import {Module} from '@nestjs/common';
import {SessionsService} from './sessions.service';
import {SessionRepository} from './sessions.repository';
import {MongooseModule} from '@nestjs/mongoose';
import {Session, SessionSchema} from './session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Session.name, schema: SessionSchema}])
  ],
  providers: [SessionsService, SessionRepository],
  exports: [SessionsService]
})
export class SessionsModule {}

export {SessionsService} from './sessions.service';
