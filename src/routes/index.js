const { Router } = require("express");

const usersRouter = require("./users.routes");
const platesRouter = require("./plates.routes");
const ingredientsRouter = require("./ingredients.routes");

const routes = Router();


routes.use("/users", usersRouter);
routes.use("/plates", platesRouter);
routes.use("/ingredients", ingredientsRouter);

module.exports = routes;