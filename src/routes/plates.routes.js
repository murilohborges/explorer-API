const { Router } = require("express");
const PlatesController = require("../controllers/PlatesController.js");
const platesRoutes = Router();
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js")

const platesController = new PlatesController();

platesRoutes.use(ensureAuthenticated);


platesRoutes.post("/", platesController.create);
platesRoutes.get("/:id", platesController.show);
platesRoutes.delete("/:id", platesController.delete);
platesRoutes.get("/", platesController.index);
platesRoutes.put("/:id", platesController.update);


module.exports = platesRoutes;