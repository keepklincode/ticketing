import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";



it("has a rout handle listening to /api/tickets for post request", async () =>{
    const response = await request(app)
        .post("/api/tickets")
        .send({});

        expect(response.status).not.toEqual(404);  

});

it("can only be accesxed if the user is signed in", async () =>{
    await request(app)
    .post("/api/tickets")
    .send({})
    .expect(401);

});

it("returns a status other than 401 if user is signed in", async () =>{
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({});

    expect(response.status).not.toEqual(401)
});

it("returns an error if an invalid tittle is provided", async () =>{
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: '',
            price: 10
        })
        .expect(400);
    
     await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            price: 10
        })
        .expect(400);        

});
it("returns an error if an invalid price is provided", async () =>{

    await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
        title: 'jksdaljl',
        price: -10
    })
    .expect(400);

 await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
        title: "kjsadzhk"
    })
    .expect(400);        

});
it("creates a ticket with valid inputs", async () =>{
    // const id = new mongoose.Types.ObjectId().toHexString();
    // add in a check to make sure a ticket was saved
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    // const title = "asdfgh";
    // const price = 30;

    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "thisface",
            price: 30
        })
        .expect(201)

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(30);
    expect(tickets[0].title).toEqual("thisface");
});

it("published an event", async() =>{

    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "thisface",
            price: 30
        })
        .expect(201)
         
        expect(natsWrapper.client.publish).toHaveBeenCalled();
})
