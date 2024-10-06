const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventory-controller");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by detail view
router.get("/detail/:inventoryId", invController.buildByDetailId);

module.exports = router;