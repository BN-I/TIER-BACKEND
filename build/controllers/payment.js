"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const user_1 = __importDefault(require("../models/user"));
const mailer_1 = require("../utils/mailer");
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not set in environment variables.");
}
const stripe = new stripe_1.default(stripeSecretKey, {
  apiVersion: "2024-10-28.acacia",
});
class paymentController {
  static createSubscription(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const { id, customerType } = req.body;
      if (!id || !customerType) {
        return res.status(400).send({ message: "Invalid request" });
      }
      try {
        const user = yield user_1.default.findOne({ _id: id });
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }
        const priceId =
          customerType === "clinic"
            ? process.env.STRIPE_PREMIUM_PRICE_ID
            : process.env.STRIPE_STANDARD_PRICE_ID;
        if (!priceId) {
          return res.status(500).send({ message: "Price ID not configured." });
        }
        const customer = yield stripe.customers.create({
          email: user.email,
          name: user.name,
        });
        const subscription = yield stripe.subscriptions.create({
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
            yield mailer_1.transporter.sendMail({
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
    });
  }
}
exports.paymentController = paymentController;
