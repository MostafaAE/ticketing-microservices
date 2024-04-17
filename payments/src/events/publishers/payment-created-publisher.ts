import { PaymentCreatedEvent, Publisher, Subjects } from "@mostatickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
