import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Logger} from "../logger/logger";
import {Observable} from 'rxjs';
import {Mode} from '../config/mode';
import {RpcException} from '@nestjs/microservices';
import * as grpc from 'grpc';
import {config} from '../config/config';

@Injectable()
export class ModeGuard implements CanActivate {
    static SERVER = new ModeGuard(Mode.Server);
    static CLIENT = new ModeGuard(Mode.Client);

    constructor(private allowedMode: Mode) {

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const metadata = context.getArgByIndex(1); // metadata
        Logger.l.log('metadata', JSON.stringify(metadata));

        if (this.allowedMode === config.getMode()) {
            return true;
        } else {
            throw new RpcException({
                code: grpc.status.UNAVAILABLE,
                message: 'Only available in mode ' + this.allowedMode.toString(),
            });
        }
    }

}
