const { Router } = require("express");
const FavPlatesController = require("../controllers/FavPlatesController.js");
const favouritesRoutes = Router();
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js")
const favouritesController = new FavPlatesController();

favouritesRoutes.post("/:id", ensureAuthenticated, favouritesController.create);
favouritesRoutes.get("/:id", ensureAuthenticated, favouritesController.show);
favouritesRoutes.delete("/:id", ensureAuthenticated, favouritesController.delete);
favouritesRoutes.get("/", ensureAuthenticated, favouritesController.index);

module.exports = favouritesRoutes;