import { Subjects, Publisher, ExpirationCompleteEvent} from "@keepklinticket/common/build";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}