const { Router, request, response } = require("express");
const PlatesController = require("../controllers/PlatesController.js");
const PlateAvatarController = require("../controllers/PlateAvatarController.js")
const platesRoutes = Router();
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js");

const multer = require("multer");
const uploadConfig = require("../configs/upload");
const upload = multer(uploadConfig.MULTER);

const platesController = new PlatesController();
const plateAvatarController = new PlateAvatarController();


platesRoutes.use(ensureAuthenticated);


platesRoutes.post("/", platesController.create);
platesRoutes.get("/:id", platesController.show);
platesRoutes.delete("/:id", platesController.delete);
platesRoutes.get("/", platesController.index);
platesRoutes.put("/:id", platesController.update);
platesRoutes.patch("/avatar/:id", upload.single("avatar"), plateAvatarController.update);


module.exports = platesRoutes;