import {Module} from '@nestjs/common';
import {config} from './config/config';
import {join} from 'path';
import {MailerModule, PugAdapter} from '@nest-modules/mailer';
import {SharedModule} from './shared/shared.module';
import { GrpcClientModule } from './grpc-client/grpc-client.module';
import { HelloworldModule } from './helloworld/helloworld.module';
import {ServeStaticModule} from '@nestjs/serve-static';

@Module({
  imports: [

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    SharedModule,
    GrpcClientModule,
    HelloworldModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
