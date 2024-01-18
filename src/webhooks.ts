import express from "express";
import { WebhookRequest } from "./server";
import { stripe } from "./lib/stripe";
import type Stripe from "stripe";
import { getPayloadClient } from "./getPayload";
import { Resend } from "resend";
import { Product } from "./payloadTypes";
import { ReceiptEmailHtml } from "./components/emails/ReceiptEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const stripeWebhookHandler = async (
  req: express.Request,
  res: express.Response
) => {
  const webhookRequest = req as any as WebhookRequest;
  const body = webhookRequest.rawBody;
  const signature = req.headers["stripe-signature"] || "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    return res
      .status(400)
      .send(
        `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`
      );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    return res.status(400).send(`Webhook Error: No user present in metadata`);
  }

  if (event.type === "checkout.session.completed") {
    const payload = await getPayloadClient();

    const user = await payload.findByID({
      collection: "users",
      id: session.metadata.userId,
    });

    if (!user) return res.status(404).json({ error: "No such user exists." });

    const order = await payload.findByID({
      collection: "orders",
      depth: 2,
      id: session.metadata.orderId,
    });

    if (!order) return res.status(404).json({ error: "No such order exists." });

    await payload.update({
      collection: "orders",
      data: {
        _isPaid: true,
      },
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });

    // send receipt
    try {
      const data = await resend.emails.send({
        from: "DigitalHippo <hello@joshtriedcoding.com>",
        to: [user.email],
        subject: "Thanks for your order! This is your receipt.",
        html: ReceiptEmailHtml({
          date: new Date(),
          email: user.email,
          orderId: session.metadata.orderId,
          products: order.products as Product[],
        }),
      });
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  return res.status(200).send();
};
