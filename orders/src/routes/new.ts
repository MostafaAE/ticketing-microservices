import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@mostatickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Find the ticket that the user is trying to purchase in the database
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    // Make sure that this ticket is not already reserved
    // Run query to look at all orders. Find and order where the ticket is the ticket we found and order status is not cancelled.
    // If we found an order from this then this ticket is reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }
    // Calculate expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    // Publish an event saying that an order is created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: { id: ticket.id, price: ticket.price },
      version: order.version,
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
