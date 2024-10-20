const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ***************************************
 * Constructs the nav HTML unordered list
 ************************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach(row => {
    list += `<li><a href="/inv/type/${row.classification_id}"
      title="See our inventory of ${row.classification_name} vehicles">
        ${row.classification_name}
      </a></li>`;
  });
  list += "</ul>";
  return list;
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid;
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>';
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid;
};

/* **************************************
* Build the detail view HTML
* ************************************ */

Util.buildDetail = async function(data) {
  let detail = '<div id="car-info"><div id="detail-display">'
  detail += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + '">';
  detail += '</div>';
  detail += '<div id="details">';
  detail += '<p><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>';
  detail += '<p><strong>Year:</strong> ' + data.inv_year + '</p>';
  detail += '<p><strong>Description:</strong> ' + data.inv_description + '</p>';
  detail += '<p><strong>Mileage:</strong> ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>';
  detail += '<p><strong>Color:</strong> ' + data.inv_color + '</p>';
  detail += '</div></div>';
  return detail;
};

Util.getManagementLinks = async function(){
  let links = '<ul>';
  links += '<li><a href="/inv/add-classification" title="Add new classification">Add new classification</a></li>';
  links += '<li><a href="/inv/add-inventory" title="Add new car">Add new car</a></li>';
  links += '</ul>';
  return links;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Logout
 * ************************************ */
Util.logout = (req, res, next) => {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/account/login")
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
