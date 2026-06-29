const express = require("express");
const adminRouter = express.Router();

const adminController = require("../controllers/adminController");

adminRouter.get("/home-list", adminController.getAdminHomeList);

adminRouter.get("/add-home/:id", adminController.getAdminAddHome);
adminRouter.post("/add-home", adminController.addAdminHome);
adminRouter.post("/delete-home/:id", adminController.deleteAdminHome);

module.exports = adminRouter;
