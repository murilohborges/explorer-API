const { Router, request, response } = require("express");
const WebhookController = require("../controllers/WebhookController.js");
const webhookRoutes = Router();
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js");
const verifyUserAuthorization = require("../middleware/verifyUserAuthorization.js");

const webhookController = new WebhookController();

webhookRoutes.use(ensureAuthenticated);

webhookRoutes.post("/", webhookController.create);
webhookRoutes.get("/", webhookController.index);


module.exports = webhookRoutes;