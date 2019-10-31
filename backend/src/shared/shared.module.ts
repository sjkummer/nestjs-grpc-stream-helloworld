import {Module} from '@nestjs/common';
import {Logger} from "../logger/logger";
import {PassportModule} from '@nestjs/passport';
import {JwtModule, JwtService} from '@nestjs/jwt';
import {jwtConstants} from './constants';
import {GrpcAuthGuard} from './grpc-auth.guard';
import {EncryptService} from './encrypt.service';
import {JwtStrategy} from './jwt.strategy';

@Module({
      imports: [
          PassportModule.register({ defaultStrategy: 'jwt' }),
          JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1800s' },
          }),
      ],
      exports: [
          EncryptService, GrpcAuthGuard, JwtStrategy, JwtModule,
      ],
    providers: [EncryptService, JwtStrategy, GrpcAuthGuard],
    controllers: [],
})
export class SharedModule {}
