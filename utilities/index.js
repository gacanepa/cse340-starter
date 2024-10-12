const invModel = require("../models/inventory-model");
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
  links += '<li><a href="/inv/classification" title="Add new classification">Add new classification</a></li>';
  links += '<li><a href="/inv/add" title="Add new car">Add new car</a></li>';
  links += '</ul>';
  return links;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
