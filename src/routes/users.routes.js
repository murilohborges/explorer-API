const { Router } = require("express");
const UsersController = require("../controllers/UsersController.js");
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js");
const UsersValidatedController = require("../controllers/UsersValidatedController");
const usersRoutes = Router();
const usersValidatedController = new UsersValidatedController();

const usersController = new UsersController();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.get("/validated", ensureAuthenticated, usersValidatedController.index);
usersRoutes.get("/", usersController.index);

module.exports = usersRoutes;