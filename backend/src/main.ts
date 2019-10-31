import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import 'reflect-metadata';
import {grpcClientOptionsClient} from './grpc-client.options.client';
import {grpcClientOptionsServer} from './grpc-client.options.server';
import {config} from './config/config';
import {Mode} from './config/mode';
import {ClientOptions} from "@nestjs/microservices";
import {join} from "path";
import {Logger} from "./logger/logger";

async function bootstrap() {

  Logger.setup(Logger.defaultName, join(__dirname, '..', 'logs'));

  process.on('unhandledRejection', (reason, promise) => {
    Logger.l.error('=== UNHANDLED REJECTION ===');
    Logger.l.error(reason.toString());
    Logger.l.error(promise);
  });

  process.on('uncaughtException', (error) => {
    Logger.l.error('=== UNHANDLED EXCEPTION ===');
    Logger.l.error(error.toString());
    Logger.l.error(error.stack);
  });
  const Sentry = require('@sentry/node');
  Sentry.init({ dsn: 'https://de64d1916dd24b49b3864f82b274c9c2@sentry.io/1525337' });

  const commandlineArguments = process.argv.slice(2);
  Logger.l.log('Commandline arguments: ');
  Logger.l.log(commandlineArguments);

  const name    = config.get('SERVERNAME');
  const version = config.get('SERVERVERSION');

  commandlineArguments.forEach((value, index) => {
    if (value === '--mode' && commandlineArguments.length >= index + 2) {
      config.overrideMode(commandlineArguments[index + 1]);
    }

    if (value === '--cloud-server') {
      if (commandlineArguments.length >= index + 2) {
        config.setCloudServer(commandlineArguments[index + 1]);
      } else {
        Logger.l.error('Missing argument for \'--cloud-server\'');
      }
    }
  });

  if (process.env.CLOUD_SERVER) {
    config.setCloudServer(process.env.CLOUD_SERVER);
  }

  if (process.env.MODE) {
    config.overrideMode(process.env.MODE);
  }

  if (config.getMode() === Mode.Client && config.getCloudServerGrpcUrl() !== null && grpcClientOptionsServer.options) {
    grpcClientOptionsServer.options.url = config.getCloudServerGrpcUrl();
  }

  const mode: Mode = config.getMode();
  Logger.setup(mode.toString(), join(__dirname, '..', 'logs'));
  const app = await NestFactory.create(AppModule, {logger: Logger.l});
  const options: ClientOptions = mode === Mode.Server ? grpcClientOptionsServer : grpcClientOptionsClient;
  const url = options.options.url;
  app.enableCors();
  await app.init();

  if (config.getMode() === Mode.Server) {
    app.connectMicroservice(options);
    await app.startAllMicroservicesAsync();
  }

  await app.listen(config.getHttpPort());

  const utcDateString = new Date().toISOString();
  Logger.l.log ('***********************************************************');
  Logger.l.log (`Server ${name}/${version} started in mode <${mode}> on <${url}> at UTC date ${utcDateString}`);
  Logger.l.log ('***********************************************************');
  if (config.getMode() === Mode.Client) {
    Logger.l.log('Server: ' + config.getCloudServerGrpcUrl());
    // Logger.l.log('Will connect to cloud server:');
    // Logger.l.log(grpcClientOptionsServer.options);
  }

}

bootstrap().catch(e => {
  Logger.l.error('Failed to start server:');
  Logger.l.error(e);
  Logger.l.error(e.toString());
});
