const { Router } = require("express");

const usersRouter = require("./users.routes");
const platesRouter = require("./plates.routes");
const ingredientsRouter = require("./ingredients.routes");
const sessionsRouter = require("./sessions.routes.js");
const favouritesRouter = require("./favourites.routes.js");
const ordersRouter = require("./orders.routes.js");
const stripeRouter = require("./stripe.routes.js");
const webhookRouter = require("./webhook.routes.js");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/plates", platesRouter);
routes.use("/ingredients", ingredientsRouter);
routes.use("/favourites", favouritesRouter);
routes.use("/orders", ordersRouter);
routes.use("/stripe", stripeRouter);
routes.use("/webhook", webhookRouter);

module.exports = routes;