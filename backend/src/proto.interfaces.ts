// This file was automatically generated from protobuf files (.proto)
// Do not edit - all changes will be overwritten!
/* tslint:disable:max-classes-per-file */

export enum StatusCode {
  SUCCESS = 0,
  ERROR = 1,
  ERROR_UNAUTHORIZED = 2,
  ERROR_NOT_IMPLEMENTED = 3,
  ERROR_INVALID_ARGUMENT = 4,
  ERROR_ALREADY_EXISTS = 5,
  ERROR_INTERNAL = 6,
}
export class Status {
  code: StatusCode;
  message: string;
}
export class HelloRequest {
  message: string;
}
export class HelloResponse {
  answer: string;
}
export class EventSubscriptionRequest {
  id: string;
}
export class Event {
  message: string;
}
