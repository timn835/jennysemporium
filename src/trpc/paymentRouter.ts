import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../getPayload";
import { stripe } from "../lib/stripe";
import type Stripe from "stripe";
import { Orders } from "@/collections/Orders";

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      let productIds = input.productIds;
      if (productIds.length === 0) throw new TRPCError({ code: "BAD_REQUEST" });

      const payload = await getPayloadClient();
      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });

      // make sure the products have a price id
      const filteredProducts = products.filter((prod) => Boolean(prod.priceId));

      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          products: filteredProducts.map((product) => product.id),
          user: user.id,
        },
      });

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      line_items.push({
        price: process.env.STRIPE_TRANSACTION_FEE_ID,
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      });

      filteredProducts.forEach((product) => {
        line_items.push({
          price: product.priceId!,
          quantity: 1,
        });
      });

      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card"],
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items,
        });

        return { url: stripeSession.url };
      } catch (error) {
        console.log(error);
        return { url: null };
      }
    }),

  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input;

      const payload = await getPayloadClient();
      const order = await payload.findByID({
        collection: "orders",
        id: orderId,
      });

      if (!order) throw new TRPCError({ code: "NOT_FOUND" });

      return { isPaid: order._isPaid };
    }),
});
