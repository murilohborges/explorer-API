const { Router, request, response } = require("express");
const WebhookController = require("../controllers/WebhookController.js");
const webhookRoutes = Router();
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js");
const verifyUserAuthorization = require("../middleware/verifyUserAuthorization.js");

const webhookController = new WebhookController();

// stripeRoutes.use(ensureAuthenticated);

webhookRoutes.post("/", webhookController.create);


module.exports = webhookRoutes;