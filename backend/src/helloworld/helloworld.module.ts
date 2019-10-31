import {forwardRef, HttpModule, Module} from '@nestjs/common';
import { HelloworldService } from './helloworld.service';
import {GrpcClientModule} from '../grpc-client/grpc-client.module';
import {HelloworldController} from "./helloworld.controller";

@Module({
  imports: [
    GrpcClientModule,
  ],
  providers: [HelloworldService],
  controllers: [
    HelloworldController,
  ],
  exports: [HelloworldService],
})
export class HelloworldModule {}
