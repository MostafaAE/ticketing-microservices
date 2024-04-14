import { OrderCancelledEvent, Publisher, Subjects } from "@mostatickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
