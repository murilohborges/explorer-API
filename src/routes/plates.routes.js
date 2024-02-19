const { Router } = require("express");
const PlatesController = require("../controllers/PlatesController.js");
const platesRoutes = Router();

const platesController = new PlatesController();


platesRoutes.post("/:user_id", platesController.create);
platesRoutes.get("/:id", platesController.show);
platesRoutes.delete("/:id", platesController.delete);
platesRoutes.get("/", platesController.index);


module.exports = platesRoutes;