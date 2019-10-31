nestjs-grpc-stream-helloworld
================

## About
This example shows how to use GRPC streams in nestjs. All require protobuf interfaces are generated autmatically. This nestjs backend can also act in both roles: GRPC-Server and GRPC-Client (common code).

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
