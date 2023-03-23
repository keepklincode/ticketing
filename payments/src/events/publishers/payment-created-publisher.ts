import { Subjects, Publisher, PaymentCreatedEvent } from "@keepklinticket/common/build";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}