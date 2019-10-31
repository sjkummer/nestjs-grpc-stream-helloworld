nestjs-grpc-stream-helloworld
================

## About
This example shows how to use GRPC streams in nestjs. All required protobuf interfaces are generated automatically. This example covers both roles: GRPC-Server or GRPC-Client (common code).

## Run as GRPC Server

```js
cd backend
npm install
npm run start:server
```

## Run as GRPC Client

```js
cd backend
npm install
npm run start:client
```

## Run as GRPC Client - and connect to a remote server

```js
cd backend
npm install
export CLOUD_SERVER=MY_MACHINE
npm run start:client
```
