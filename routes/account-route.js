const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/account-controller");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation');

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegistration));
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;