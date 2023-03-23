import mongoose from "mongoose";
import {Message} from "node-nats-streaming"
import { Ticket } from "../../../models/ticket";
import { Listener, OrderCancelledEvent } from "@keepklinticket/common/build";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";


const setup = async () =>{
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: "concert",
        price: 20,
        userId: "asdfg",
    });

    ticket.set({orderId});

    await ticket.save();

    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }

    };
    
    // @ts-ignore
    const msg: Messsage = {
        ack: jest.fn()
    }; 

    return {data, msg, orderId, listener, ticket}


};

it("updates a ticket, publishes an event, and acks a the message", async () => {
    const {data, msg, orderId, listener, ticket} =  await setup();

    await listener.onMessage(data, msg);

     const updatedTicket = await Ticket.findById(ticket.id);

     expect(updatedTicket!.orderId).not.toBeDefined();

     expect(msg.ack).toHaveBeenCalled();
     
     expect(natsWrapper.client.publish).toHaveBeenCalled();
})