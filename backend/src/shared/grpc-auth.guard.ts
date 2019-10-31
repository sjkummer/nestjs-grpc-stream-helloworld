import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Logger} from "../logger/logger";
import {Observable, throwError} from 'rxjs';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class GrpcAuthGuard implements CanActivate {

    constructor(private  jwtService: JwtService) {

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const metadata = context.getArgByIndex(1); // metadata
        if (!metadata) {
            return false;
        }
        let token = metadata.get('authorization')[0];
        const prefix = 'Bearer ';
        if (!token.includes(prefix)) {
            return false;
        }

        token = token.slice(token.indexOf(' ') + 1);
        try {
            const valid = this.jwtService.verify(token);
            Logger.l.log('valid token', JSON.stringify(valid));
            return true;
        } catch (e) {
            return false;
        }
    }
}
