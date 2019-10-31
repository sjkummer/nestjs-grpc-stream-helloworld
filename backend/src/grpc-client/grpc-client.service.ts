import {Injectable} from '@nestjs/common';
import {Logger} from "../logger/logger";
import {
    EventSubscriptionRequest,
    HelloRequest, HelloResponse,
} from '../proto.interfaces';
import {Observable, Subject, Subscription} from 'rxjs';
import {Client, ClientGrpc} from '@nestjs/microservices';
import {config} from '../config/config';
import {Mode} from '../config/mode';
import {grpcClientOptionsServer} from '../grpc-client.options.server';
import uuid = require("uuid");

export interface RemoteHelloWorldService {
    sayHello(request: HelloRequest): Observable<HelloResponse>;
    subscribeEvents(request: EventSubscriptionRequest): Observable<Event>;
}

@Injectable()
export class GrpcClientService {

    @Client(grpcClientOptionsServer)
    private client: ClientGrpc;

    private helloWorldService: RemoteHelloWorldService;
    private eventsSubscription: Subscription;

    private providedEventSubject: Subject<Event> = new Subject<Event>();
    private providedEventObservable: Observable<Event>;

    private didConnectToCloudServerSubject: Subject<boolean> = new Subject<boolean>();
    private didConnectToServerObservable: Observable<boolean>;

    public isConnectedToCloudServer = false;

    private connectionWatchdog: NodeJS.Timeout;

    constructor() {
        this.providedEventObservable = this.providedEventSubject.asObservable();
        this.didConnectToServerObservable = this.didConnectToCloudServerSubject.asObservable();
    }

    onModuleInit(): any {

        if (config.getMode() === Mode.Client) {
            this.helloWorldService = this.client.getService<RemoteHelloWorldService>('HelloWorldService');

            this.subscribeConnectorMessagesFromCloudServer().catch(e => {
                Logger.l.warn('Failed to subscribe connector events:');
                Logger.l.warn(e);
            });

            this.connectionWatchdog = setInterval(() => {

                if (!this.eventsSubscription || this.eventsSubscription.closed) {
                    this.subscribeConnectorMessagesFromCloudServer().catch(e => {
                        Logger.l.warn('Watchdog: Failed to subscribe connector events:');
                        Logger.l.warn(e);
                    });
                } else {
                    Logger.l.debug('Watchdog: GRPC stream subscription is up and running');
                }

            }, 5000);
        }
    }

    getHelloWorldService(): RemoteHelloWorldService {
        return this.helloWorldService;
    }

    /**
     * This only needs to be triggered after the connector was newly registered at a cloud server
     */
    async subscribeConnectorMessagesFromCloudServer() {

        if (config.getMode() === Mode.Client) {
            if (!this.eventsSubscription || this.eventsSubscription.closed) {
                const request: EventSubscriptionRequest = {
                    id: uuid(),
                };
                const observable = this.helloWorldService.subscribeEvents(request);

                const subscription = observable.subscribe(message => {
                    Logger.l.log('Received a message from cloud server:');
                    Logger.l.log(message);
                    this.providedEventSubject.next(message);

                }, error => {
                    Logger.l.error('Subscribing events from cloud server ended with error: ' + error.toString());
                    Logger.l.error(error);
                    this.updateConnectionStatus(false);

                }, () => {
                    Logger.l.warn('Subscribing events from cloud server ended.');
                    this.updateConnectionStatus(false);
                });

                this.eventsSubscription = subscription;
                this.updateConnectionStatus(true);

                Logger.l.log('Did subscribe messages from cloud server.');
                return true;
            }
        } else {
            Logger.l.warn('subscribeConnectorMessagesFromCloudServer was called in wrong mode');
        }
    }

    private updateConnectionStatus(isConnectedToCloudServer: boolean) {
        this.isConnectedToCloudServer = isConnectedToCloudServer;
        if (isConnectedToCloudServer === false) {
            this.eventsSubscription = null;
        }
        this.didConnectToCloudServerSubject.next(isConnectedToCloudServer);
    }

    getConnectorEventSubscription(): Observable<Event> {
        return this.providedEventObservable;
    }

    getConnectionStateChanged(): Observable<boolean> {
        return this.didConnectToServerObservable;
    }

}
