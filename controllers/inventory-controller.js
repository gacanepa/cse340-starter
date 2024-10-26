const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***********************
 *  Build management view
 * ******************** */
invCont.buildManagement = async function (req, res, next) {
  const nav = await utilities.getNav();
  const links = await utilities.getManagementLinks();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "CSE Motors Inventory Management",
    nav,
    links,
    classificationSelect,
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

/* ***************************
 *  Build inventory form
 * ************************ */
invCont.buildAddInventory = async function (req, res, next) {
  const classifications = await invModel.getClassifications();
  const nav = await utilities.getNav();
  res.render("./inventory/add-inventory", {
    title: "Add a car",
    classifications: classifications.rows,
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
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the classification was not added.")
    res.status(501).render("inventory/add-classification", {
      title: "Add new classification",
      nav,
    })
  }
}

/* ************************
 *  Add new inventory
 * ********************* */
invCont.addInventory = async function (req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_price,
    inv_color,
    inv_year,
    inv_description,
    inv_miles,
    classification_id,
   } = req.body;
  const newCar = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_price,
    inv_color,
    inv_year,
    inv_description,
    '/images/vehicles/no-image.png',
    '/images/vehicles/no-image-tn.png',
    inv_miles,
    classification_id
  );
  const classifications = await invModel.getClassifications();
  const nav = await utilities.getNav();

  if (newCar) {
    req.flash(
      "notice",
      `Congratulations, a new ${inv_color} ${inv_make}-${inv_model} was added.`
    )
    res.status(201).render("inventory/add-inventory", {
      title: "Add new inventory",
      nav,
      errors: null,
      classifications: classifications.rows,
    })
  } else {
    req.flash("notice", "Sorry, the car was not added.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add new car",
      nav,
      classifications: classifications.rows,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Return Inventory item by ID As JSON
 * ************************** */
invCont.getInventoryItemJSON = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id)
  const invData = await invModel.getInventoryById(inv_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId)
  const classifications = await invModel.getClassifications();
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    classifications: classifications.rows,
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classifications = await invModel.getClassifications();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const item = updateResult.rows[0];
    const itemName = item.inv_make + " " + item.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    classifications: classifications.rows,
    })
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId)
  const classifications = await invModel.getClassifications();
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    classifications: classifications.rows,
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classifications = await invModel.getClassifications();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
    classification_id,
  } = req.body
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash("notice", `The car was successfully deleted from the inventory.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      classifications: classifications.rows,
    })
  }
}

module.exports = invCont;
