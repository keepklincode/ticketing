import express, { Request, Response}  from "express";
import { body } from "express-validator";
import { validateRequest, requireAuth, NotFoundError, NotAuthorizedError, BadRequestError } from "@keepklinticket/common/build";

// import { validateRequest } from "@keepklinticket/common/build/middlewares/validate-request";
// import {  requireAuth } from "@keepklinticket/common/build/middlewares/require-auth";
// import { NotFoundError } from "@keepklinticket/common/build/errors/not-found-error";
// import { NotAuthorizedError } from "@keepklinticket/common/build/errors/not-authorized-error";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";





const router = express.Router();

router.put("/api/tickets/:id", requireAuth, [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").isFloat({gt: 0}).withMessage("Price mut be greater than 0")
],
validateRequest, async (req: Request, res: Response) =>{
    
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket) {
        throw new NotFoundError();
    };

    if(ticket.orderId){
        throw new BadRequestError("can not edith a reserved ticket")
    }

    if(ticket.userId !== req.currentUser!.id){
        throw new NotAuthorizedError
    }


    ticket.set({
        title: req.body.title,
        price: req.body.price
    });

    await ticket.save(); 

    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })
    res.send(ticket);
});

export { router as updateTicketRouter };