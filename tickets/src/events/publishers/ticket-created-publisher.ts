import { Subjects, Publisher, TicketCreatedEvent } from "@keepklinticket/common/build";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

}