const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventory-controller");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByDetailId));

module.exports = router;
