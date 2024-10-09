const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/account-controller");
const utilities = require("../utilities");

router.get("/login", utilities.handleErrors(accountController.buildLogin));

module.exports = router;