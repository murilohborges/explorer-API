const { Router, request, response } = require("express");
const OrdersController = require("../controllers/OrdersController.js");
const ordersRoutes = Router();
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js");
const verifyUserAuthorization = require("../middleware/verifyUserAuthorization.js");

const ordersController = new OrdersController();

ordersRoutes.use(ensureAuthenticated);

ordersRoutes.post("/", ordersController.create);


module.exports = ordersRoutes;