import { Request, Response } from "express";
import Stripe from "stripe";
import User from "../models/user";
import { transporter } from "../utils/mailer";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not set in environment variables.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-10-28.acacia",
});

class paymentController {
  static async createSubscription(req: Request, res: Response) {
    const { id, customerType } = req.body;

    if (!id || !customerType) {
      return res.status(400).send({ message: "Invalid request" });
    }

    try {
      const user = await User.findOne({ _id: id });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const priceId =
        customerType === "Clinic"
          ? process.env.STRIPE_PREMIUM_PRICE_ID
          : process.env.STRIPE_STANDARD_PRICE_ID;

      if (!priceId) {
        return res.status(500).send({ message: "Price ID not configured." });
      }

      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });

      const latestInvoice = subscription.latest_invoice;
      if (latestInvoice && typeof latestInvoice !== "string") {
        const paymentIntent = latestInvoice.payment_intent;
        if (paymentIntent && typeof paymentIntent !== "string") {
          res.status(200).send({
            subscriptionId: subscription.id,
            clientSecret: paymentIntent.client_secret,
          });

          user.amountPaid = latestInvoice.total / 100;

          await user.save();

          await transporter.sendMail({
            from: process.env.SMTP_USER, // sender address
            to: process.env.SMTP_USER, // list of receivers
            subject: `New ${customerType} payment has been recieved.`, // Subject line
            text: `New ${customerType} payment has been recieved. ${user.name} is waiting for credentials.`, // plain text body
          });
          return;
        }
      }

      res.status(500).send({ message: "Failed to retrieve payment intent." });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Subscription creation failed" });
    }
  }
}

export { paymentController };
