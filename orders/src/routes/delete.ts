import express, { Request, Response} from "express";
import { Order, OrderStatus}  from "../models/order";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@keepklinticket/common/build";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete("/api/orders/:orderId", requireAuth,  async (req: Request, res: Response) =>{

    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("ticket");
    // populate("ticket") is used to get the information associated with this order, 

    if(!order){
        throw new NotFoundError();
    };

    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    };

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
            // from the above populate("ticket"), is where u got the ticket id of the order we want to cancel
        }
    });

    res.status(204).send(order);  
});

export { router as deleteOrderRouter};