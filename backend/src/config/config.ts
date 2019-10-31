import {Mode} from './mode';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import {Logger} from "../logger/logger";

import * as path from 'path';

export class Config {

    static readonly fileRootDirectory: string = path.normalize(path.dirname(require.main.filename) +
        path.sep + '..' + path.sep + 'public' + path.sep + 'record_files' + path.sep);
    static readonly localConnectorSubdir = 'local';

    private readonly envConfig: { [key: string]: string };
    private modeOverride: Mode = undefined;
    private cloudServer: string = 'localhost';

    constructor() {
        const filePath = '.env';
        this.envConfig = dotenv.parse(fs.readFileSync(filePath));
        Logger.l.log('Using .env file from path ' + filePath);

        try {
            fs.mkdirSync(Config.fileRootDirectory, {recursive: true});

            this.cloudServer = this.get('CLOUD_SERVER');

        } catch (e) {
            Logger.l.error('Failed to create root directory for recording files:');
            Logger.l.error(e);
        }
    }

    get(key: string): string {
        return this.envConfig[key];
    }

    getMode(): Mode {
        const modeFromConfig: Mode = Config.modeFromString(this.get('MODE'));
        return this.modeOverride ? this.modeOverride : ( modeFromConfig ? modeFromConfig : Mode.Client );
    }

    overrideMode(mode: string) {
        this.modeOverride = Config.modeFromString(mode);
    }

    getVariant(key: string, forMode: Mode): string {
        const variantKey = key + '_' + forMode.toUpperCase();
        return this.get(variantKey);
    }

    getCurrentVariant(key: string) {
        return this.getVariant(key, this.getMode());
    }

    static toBoolean(value: string): boolean {
        return value  === 'true';
    }

    static toNumber(value: string, radix?: number): number {
        return parseInt(value, radix);
    }

    getAsBoolean(key: string): boolean {
        return Config.toBoolean(this.get(key));
    }

    getAsNumber(key: string): number {
        return Config.toNumber(this.get(key));
    }

    getAsBooleanForCurrentVariant(key: string): boolean {
        return Config.toBoolean(this.getCurrentVariant(key));
    }

    getAsNumberForCurrentVariant(key: string): number {
        return Config.toNumber(this.getCurrentVariant(key));
    }

    getAsBooleanForVariant(key: string, mode: Mode): boolean {
        return Config.toBoolean(this.getVariant(key, mode));
    }

    getAsNumberForVariant(key: string, mode: Mode): number {
        return Config.toNumber(this.getVariant(key, mode));
    }

    setCloudServer(domain: string) {
        this.cloudServer = domain;
    }

    getCloudServerGrpcUrl(): string {
        return this.cloudServer + ':' + Config.toNumber(this.getVariant('GRPC_PORT', Mode.Server));
    }

    getCloudServerHttpUrl(): string {
        return 'http://' + this.cloudServer + ':' + Config.toNumber(this.getVariant('HTTP_PORT', Mode.Server)) + '/';
    }

    getHttpPort(): number {
        return this.getAsNumberForCurrentVariant('HTTP_PORT');
    }

    static modeFromString(mode: string): Mode {
        let result: Mode;
        Object.keys(Mode).forEach((key, index, array) => {
            const value = Mode[key];
            if (value === mode) {
                result = value;
            }
        });
        return result;
    }

}

export const config: Config = new Config();
