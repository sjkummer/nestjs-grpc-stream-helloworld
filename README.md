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

### Connect to a remote server

```js
export CLOUD_SERVER=MY_REMOTE_SERVER
npm run start:client
```
## Update Protobuf Interfaces

After extending a .PROTO file, the required interfaces for nestjs can be generated as follows:
```js
cd backend
npm run generate:proto
```
