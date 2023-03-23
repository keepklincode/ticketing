import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { body } from "express-validator";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";



it("returns a 404 if the provided id does not exist", async () =>{
    const id = new mongoose.Types.ObjectId().toHexString();
    
     const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", global.signin())
        .send({
            title: "faceoff",
            price: 40,
        })
        // .expect(404);

        expect(response.status).not.toEqual(404)
       
})

it("returns a 401 if the user is not authenticated", async () =>{
    const id = new mongoose.Types.ObjectId().toHexString();
    
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "faceoff",
            price: 45
        })
        .expect(401)
    
})

it("returns a 401 if the user does not own a ticket ", async () =>{
    // const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "thisisme",
            price: 25
        });
        

        await request(app)
            .put(`/api/ticket/${response.body.id}`)
            .set("Cookie", global.signin())
            .send({
                title: "thisisnotme",
                price: 52
            })
            // .expect(401);

            expect(response.status).not.toEqual(401)
    
})

it("returns a 401 if the user provides invalid price and title ", async () =>{
    const cookie = global.signin();

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "thisisme",
            price: 25
        });

     await request(app)
        .put(`/api/tickets/${response .body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 25
        })
        .expect(400);
    
        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "kakakdjsjsdja",
            price: -19 
        })
        .expect(400);
})

it("updates the ticket provided valid input", async () =>{
    const cookie = global.signin();

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "thisisme",
            price: 25
        })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "New title",
            price: 100
        })
        .expect(200);

        const ticketResponse = await request(app)
            .get(`/api/tickets/${response.body.id}`)
            .send();


        expect(ticketResponse.body.title).toEqual("New title");
        expect(ticketResponse.body.price).toEqual(100);
    
})

it("published an event", async () =>{
    const cookie = global.signin();

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "thisisme",
            price: 25
        })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "New title",
            price: 100
        })
        .expect(200);

        expect(natsWrapper.client.publish).toHaveBeenCalled();

});

it("Reject update if the ticket is reserved", async () => {

    const cookie = global.signin();

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "thisisme",
            price: 25
        })
        .expect(201);

        const ticket = await Ticket.findById(response.body.id);
        
        ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });

        await ticket!.save();

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "New title",
            price: 100
        })
        .expect(400);

});