const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/account-controller");
const utilities = require("../utilities");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegistration));
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;