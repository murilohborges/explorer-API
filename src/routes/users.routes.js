const { Router } = require("express");
const UsersController = require("../controllers/UsersController.js");
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js");
const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);

module.exports = usersRoutes;