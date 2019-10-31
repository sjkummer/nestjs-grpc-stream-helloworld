import {forwardRef, Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {Logger} from "../logger/logger";
import {config} from '../config/config';
import {Mode} from '../config/mode';
import {
    EventSubscriptionRequest, HelloRequest, HelloResponse,
    Event,
    Status,
    StatusCode,
} from '../proto.interfaces';
import {Observable, Subject} from 'rxjs';
import {Utils} from '../utils';
import {v4 as uuid} from 'uuid';

@Injectable()
export class HelloworldService implements OnModuleInit {

    private subjectForEndpoint: Map<string, Subject<Event>> = new Map();
    private observableForEndpoint: Map<string, Observable<Event>> = new Map();
    private onNewEndpointConnectedSubscriber = new Subject<string>();
    private readonly onNewEndpointConnectedObserver: Observable<string>;

    private eventCount = 0;

    constructor() {
        this.onNewEndpointConnectedObserver = this.onNewEndpointConnectedSubscriber.asObservable();

        if (config.getMode() === Mode.Server) {
            setInterval(() => {

                this.observableForEndpoint.forEach((observable, endpointId) => {

                    const event: Event = {message: ''+this.eventCount++};
                    this.sendEventToConnector(endpointId, event);

                });

            }, 1000);
        }
    }

    onModuleInit() {
    }

    async sayHello(request: HelloRequest): Promise<HelloResponse> {
        const response: HelloResponse = {
            answer: 'ello',
        };
        return response;
    }

    subscribeEvents(request: EventSubscriptionRequest): Observable<Event> {

        if (config.getMode() === Mode.Server) {
            const self = this;

            if (request.id) {
                const existingObservable: Observable<Event> = this.observableForEndpoint.get(request.id);

                Logger.l.log('A new endpoint connected with ID: ' + request.id);
                setTimeout(() => {
                    self.onNewEndpointConnectedSubscriber.next(request.id);
                }, 500);

                if (existingObservable) {
                    return existingObservable;
                } else {
                    const subject = new Subject<Event>();
                    const observable = subject.asObservable();
                    this.subjectForEndpoint.set(request.id, subject);
                    this.observableForEndpoint.set(request.id, observable);
                    return observable;
                }
            } else {
                return undefined;
            }
        } else {
            Logger.l.error('subscribeConnecorEvents was called in wrong mode');
            return undefined;
        }
    }

    sendEventToConnector(endpointId: string, event: Event): boolean {
        const s = this.subjectForEndpoint.get(endpointId);
        if (s) {
            s.next(event);
            return true;
        } else {
            Logger.l.warn('Failed to send a Event to endpoint with ID ' + endpointId + ' - no such endpoint is connected');
        }
        return false;
    }

    onNewConnectorConnected(): Observable<string> {
        return this.onNewEndpointConnectedObserver;
    }

}
