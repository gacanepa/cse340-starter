const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***********************
 *  Build management view
 * ******************** */
invCont.buildManagement = async function (req, res, next) {
  const nav = await utilities.getNav();
  const links = await utilities.getManagementLinks();
  res.render("./inventory/management", {
    title: "CSE Motors Inventory Management",
    nav,
    links,
  });
}

/* ***************************
 *  Build classification form
 * ************************ */
invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add a classification",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Build inventory by classification view
 * ************************************* */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  const nav = await utilities.getNav();
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ************************
 *  Add new classification
 * ********************* */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  const newClassification = await invModel.addClassification(classification_name);
  const nav = await utilities.getNav();

  if (newClassification) {
    req.flash(
      "notice",
      `Congratulations, ${classification_name} was  added.`
    )
    res.status(201).render("inventory/add-classification", {
      title: "Add new classification",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the classification was not added.")
    res.status(501).render("inventory/add-classification", {
      title: "Add new classification",
      nav,
    })
  }
}

/* ****************************************
 *  Build inventory by detail view
 * ************************************* */
invCont.buildByDetailId = async function (req, res, next) {
  const inventoryId = req.params.inventoryId;
  const data = await invModel.getInventoryById(inventoryId);
  const detail = await utilities.buildDetail(data);
  const nav = await utilities.getNav();
  res.render("./inventory/detail", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    detail,
  });
};

module.exports = invCont;
