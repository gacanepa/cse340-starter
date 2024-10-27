const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventory-controller");
const utilities = require("../utilities");
const regValidateClassification = require("../utilities/classification-validation");
const regValidateInventory = require("../utilities/inventory-validation");

// Route to build management view
router.get(
  "/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement)
);

// Route to get the classification form
router.get(
  "/add-classification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

// Route to get the classification form
router.get(
  "/add-inventory",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);

// Route to add new classifications
router.post(
  "/add-classification",
  utilities.checkAccountType, 
  regValidateClassification.classificationRules(),
  regValidateClassification.checkRegData,
  utilities.handleErrors(invController.addClassification)
);

// Route to add new cars
router.post(
  "/add-inventory",
  utilities.checkAccountType, 
  regValidateInventory.classificationRules(),
  regValidateInventory.checkRegData,
  utilities.handleErrors(invController.addInventory)
);

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory by detail view
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByDetailId)
);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

router.get(
  "/edit/:inventoryId",
  utilities.checkAccountType,
  utilities.handleErrors(invController.editInventoryView)
)

router.get(
  "/delete/:inventoryId",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventoryView)
)

router.get(
  "/auditLog",
  utilities.checkAccountType,
  utilities.handleErrors(invController.getAuditLog)
)

router.post(
  "/delete/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
)

router.post(
  "/update/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router;
