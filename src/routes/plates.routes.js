const { Router, request, response } = require("express");
const PlatesController = require("../controllers/PlatesController.js");
const PlateAvatarController = require("../controllers/PlateAvatarController.js")
const platesRoutes = Router();
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js");
const verifyUserAuthorization = require("../middleware/verifyUserAuthorization.js")

const multer = require("multer");
const uploadConfig = require("../configs/upload");
const upload = multer(uploadConfig.MULTER);

const platesController = new PlatesController();
const plateAvatarController = new PlateAvatarController();


platesRoutes.use(ensureAuthenticated);


platesRoutes.post("/", verifyUserAuthorization("admin"), platesController.create);
platesRoutes.get("/:id", platesController.show);
platesRoutes.delete("/:id", verifyUserAuthorization("admin"), platesController.delete);
platesRoutes.get("/", platesController.index);
platesRoutes.put("/:id", verifyUserAuthorization("admin"), platesController.update);
platesRoutes.patch("/avatar/:id", verifyUserAuthorization("admin"), upload.single("avatar"), plateAvatarController.update);


module.exports = platesRoutes;