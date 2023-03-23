import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("fetches the ticket", async () =>{
    //  Create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 30
    });
    await ticket.save();

    const user = global.signin();
// make a request to b uild an order with the ticket;

    const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ticketId: ticket.id})
    .expect(201);

// make request to fetch the order

    const { body: fetchedOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(200);

        expect(fetchedOrder.id).toEqual(order.id);
});



it("returns an error if user try to fetch another user's order", async () =>{
    //  Create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 30
    });
    await ticket.save();

    const user = global.signin();
// make a request to b uild an order with the ticket;

    const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ticketId: ticket.id})
    .expect(201);

// make request to fetch the order

    
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", global.signin())
        .send()
        .expect(401)
});
