const { Router, request, response } = require("express");
const StripeController = require("../controllers/StripeController.js");
const stripeRoutes = Router();
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js");
const verifyUserAuthorization = require("../middleware/verifyUserAuthorization.js");

const stripeController = new StripeController();

stripeRoutes.use(ensureAuthenticated);

stripeRoutes.post("/", verifyUserAuthorization("customer"), stripeController.create);


module.exports = stripeRoutes;