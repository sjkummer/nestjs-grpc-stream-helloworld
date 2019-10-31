import {ClientOptions, GrpcOptions, Transport} from '@nestjs/microservices';
import { join } from 'path';
import {config} from "./config/config";
import {Mode} from "./config/mode";

export const grpcClientOptionsClient: GrpcOptions = {
    transport: Transport.GRPC,
    options: {
        url: '0.0.0.0:' + config.getAsNumberForVariant('GRPC_PORT', Mode.Client),
        package: 'demo',
        protoPath: join(__dirname, './../../messaging/client.proto'),
        maxSendMessageLength: 1024 * 1024 * config.getAsNumber('GRPC_MAX_REQUEST_SIZE_IN_MB'),
        maxReceiveMessageLength: 1024 * 1024 * config.getAsNumber('GRPC_MAX_REQUEST_SIZE_IN_MB'),
        // credentials : ServerCredentials.createSsl('', ''),
    },
};
