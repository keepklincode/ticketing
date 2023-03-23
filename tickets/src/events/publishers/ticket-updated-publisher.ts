import { Subjects, Publisher, TicketUpdatedEvent } from "@keepklinticket/common/build";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

}