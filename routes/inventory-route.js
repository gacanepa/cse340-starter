const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventory-controller");
const utilities = require("../utilities");
const regValidate = require("../utilities/classification-validation");

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to get the classification form
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to add new classifications
router.post(
  "/add-classification",
  regValidate.classificationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(invController.addClassification)
);

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByDetailId));

module.exports = router;
