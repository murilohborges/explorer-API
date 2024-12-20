const { Router, request, response } = require("express");
const WebhookController = require("../controllers/WebhookController.js");
const webhookRoutes = Router();

const webhookController = new WebhookController();

webhookRoutes.post("/", webhookController.create);
webhookRoutes.get("/", webhookController.index);


module.exports = webhookRoutes;