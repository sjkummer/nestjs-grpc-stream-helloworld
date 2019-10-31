import {GrpcOptions, Transport} from '@nestjs/microservices';
import {join} from 'path';
import {config} from "./config/config";
import {Mode} from "./config/mode";

export const grpcClientOptionsServer: GrpcOptions = {
    transport: Transport.GRPC,
    options: {
        url: '0.0.0.0:' + config.getAsNumberForVariant('GRPC_PORT', Mode.Server),
        package: 'demo',
        protoPath: join(__dirname, './../../messaging/server.proto'),
        maxSendMessageLength: 1024 * 1024 * config.getAsNumber('GRPC_MAX_REQUEST_SIZE_IN_MB'),
        maxReceiveMessageLength: 1024 * 1024 * config.getAsNumber('GRPC_MAX_REQUEST_SIZE_IN_MB'),
        // credentials : ServerCredentials.createSsl('', ''),
    },
};
