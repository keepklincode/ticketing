import { OrderCancelledEvent, Subjects, Listener, OrderStatus } from "@keepklinticket/common/build";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {

        const order = await Order.findById({
            _id: data.id,
            version: data.version -1
        });

        if(!order) {
            throw new Error("order not found");
        };

        order.set({ status: OrderStatus.Cancelled});

        await order.save();

        msg.ack();
    }
};