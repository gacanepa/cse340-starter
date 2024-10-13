const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid make."),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid model."),
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide a valid price."),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid color."),
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide a valid year."),
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide a valid classification."),
    body("inv_description")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid description."),
    body("inv_miles")
      .trim()
      .escape()
      .isNumeric()
      .withMessage("Please provide a valid mileage."),
  ]
}

/* ******************************************************************
 * Check data and return errors or continue to adding inventory
 * *************************************************************** */
validate.checkRegData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_price,
    inv_color,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_miles,
    classification_id,
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classifications = await invModel.getClassifications()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add new car",
      nav,
      inv_make,
      inv_model,
      inv_price,
      inv_color,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_miles,
      classification_id,
      classifications: classifications.rows,
    })
    return
  }
  next()
}

module.exports = validate;
