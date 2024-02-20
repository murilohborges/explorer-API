const { Router } = require("express");
const IngredientsController = require("../controllers/IngredientsController.js");
const ingredientsRoutes = Router();

const ingredientsController = new IngredientsController();


ingredientsRoutes.get("/:user_id", ingredientsController.index);




module.exports = ingredientsRoutes;