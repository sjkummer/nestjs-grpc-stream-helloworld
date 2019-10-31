import {LoggerService, LoggerTransport} from "nest-logger";

export class Logger {
    static defaultName = 'general';
    static l: any = new LoggerService(Logger.defaultName, 'default', [LoggerTransport.CONSOLE]);

    static setup(name: string, path: string) {
        Logger.l = new LoggerService('debug', name, [LoggerTransport.CONSOLE, LoggerTransport.ROTATE], path);
    }

}
