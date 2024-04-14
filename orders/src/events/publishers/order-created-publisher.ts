import { OrderCreatedEvent, Publisher, Subjects } from "@mostatickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
