import express, { Request, Response } from "express";
import { body } from "express-validator";
// We us this body function to validate certain properties from the incoming request body
import {  validateRequest, requireAuth } from "@keepklinticket/common/build";
// import { currentUser} from "@keepklinticket/common/build/middlewares/current-user";
// import { validateRequest } from "@keepklinticket/common/build/middlewares/validate-request";
// import {  requireAuth } from "@keepklinticket/common/build/middlewares/require-auth";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();



router.post("/api/tickets", requireAuth, [
    body("title").not().isEmpty().withMessage("title is required"),
    body("price").isFloat({gt: 0}).withMessage("price must be greater than 0"),
],

    validateRequest, 
    async (req: Request, res: Response) => {
    const {title, price} = req.body;

    const ticket = Ticket.build({
        title,
        price,
        // userId: id
        userId: req.currentUser!.id
    });

    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version

    })

    res.status(201).send(ticket);                                                                                            
});




export { router as createTicketRouter };