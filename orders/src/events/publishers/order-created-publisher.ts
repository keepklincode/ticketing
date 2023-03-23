import { Publisher, OrderCreatedEvent, Subjects } from "@keepklinticket/common/build";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
        subject: Subjects.OrderCreated = Subjects.OrderCreated;

         
}