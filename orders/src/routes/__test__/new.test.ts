import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";



it("returns an error if the ticket does not exist", async () =>{
    const ticketId = new mongoose.Types.ObjectId();
    
    await request(app)
     .post("/api/orders")
     .set("Cookie", global.signin())
     .send({ ticketId })
     .expect(400);
});


it("return an error if the ticket is already reserved", async ()=>{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    });
     await ticket.save();
     const order = Order.build({
        ticket,
        userId: "asdfghjk",
        status: OrderStatus.Created,
        expiresAt: new Date ()
     });

     await order.save();

    await request(app)
     .post("/api/orders")
     .set("Cookie", global.signin())
     .send({ticketId: ticket.id})
     expect(404)
    //  expect(response.status).not.toEqual(404)
});


it("it reserves a ticket", async () =>{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    })
    await ticket.save();

    await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id})
    .expect(201)

});

it("emit an order created event", async () =>{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    })
    await ticket.save();

    await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id})
    .expect(201);

    expect(natsWrapper.client.publish).toBeCalled();
});
