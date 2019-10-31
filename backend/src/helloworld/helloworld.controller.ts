import {Body, Controller, UseGuards} from '@nestjs/common';
import {Logger} from "../logger/logger";
import {HelloworldService} from "./helloworld.service";
import {ModeGuard} from "../shared/mode.guard";
import {GrpcMethod} from "@nestjs/microservices";
import {
    Event, EventSubscriptionRequest, HelloRequest, HelloResponse,
    Status,
    StatusCode,
} from '../proto.interfaces';
import {Metadata} from 'grpc';
import {Observable} from 'rxjs';

@Controller('helloworld')
export class HelloworldController {
    constructor(private connectorManagementService: HelloworldService) {
    }

    @UseGuards(ModeGuard.SERVER)
    @GrpcMethod('HelloWorldService')
    async sayHello(request: HelloRequest, metadata: Metadata): Promise<HelloResponse> {
        return await this.connectorManagementService.sayHello(request);
    }

    @UseGuards(ModeGuard.SERVER)
    @GrpcMethod('HelloWorldService')
    subscribeEvents(@Body() request: EventSubscriptionRequest): Observable<Event> {
        return this.connectorManagementService.subscribeEvents(request);
    }
}
