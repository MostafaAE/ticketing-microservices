import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@mostatickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
