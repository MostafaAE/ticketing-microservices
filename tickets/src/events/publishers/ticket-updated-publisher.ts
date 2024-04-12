import { Publisher, Subjects, TicketUpdatedEvent } from "@mostatickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
