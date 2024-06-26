import { Publisher, Subjects, TicketCreatedEvent } from "@mostatickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
