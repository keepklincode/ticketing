import { Publisher, OrderCancelledEvent, Subjects } from "@keepklinticket/common/build";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}; 