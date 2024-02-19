const { Router } = require("express");

const usersRouter = require("./users.routes");
const platesRouter = require("./plates.routes");

const routes = Router();


routes.use("/users", usersRouter);
routes.use("/plates", platesRouter);

module.exports = routes;