import {Module} from '@nestjs/common';
import { GrpcClientService } from './grpc-client.service';
import {SharedModule} from '../shared/shared.module';

@Module({
  imports: [
    SharedModule,
  ],
  providers: [GrpcClientService],
  exports: [GrpcClientService],
})
export class GrpcClientModule {}
