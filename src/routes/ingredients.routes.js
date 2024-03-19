const { Router } = require("express");
const IngredientsController = require("../controllers/IngredientsController.js");
const ingredientsRoutes = Router();
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js")

const ingredientsController = new IngredientsController();


ingredientsRoutes.get("/", ensureAuthenticated, ingredientsController.index);




module.exports = ingredientsRoutes;