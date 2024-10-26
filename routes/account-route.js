const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/account-controller");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation');

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));
router.get("/logout", utilities.logout, utilities.handleErrors(accountController.accountLogout));
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegistration));
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Get the account info
router.get(
  "/update/:accountId",
  utilities.checkLogin,
  utilities.handleErrors(accountController.getAccountInfo)
)

// Process the info update request
router.post(
  "/update/",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process the info update request
router.post(
  "/update/password/",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router;