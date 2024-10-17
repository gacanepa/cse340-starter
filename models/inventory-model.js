const pool = require("../database/");

async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* **********************************************************************
 *  Get all inventory items and classification_name by classification_id
 * ******************************************************************* */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* **************************
 *  Get inventory item by id
 * *********************** */
async function getInventoryById(id) {
  try {
    const data = await pool.query("SELECT * FROM public.inventory WHERE inv_id = $1", [id]);
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryById error " + error);
  }
}

/* **************************
 *  Insert new classification
 * *********************** */
async function addClassification(classification_name) {
  try {
    return await pool.query("INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *", [classification_name]);
  } catch (error) {
    console.error("addClassification error " + error);
  }
}

/* **************************
 *  Insert new inventory
 * *********************** */
async function addInventory(
  inv_make,
  inv_model,
  inv_price,
  inv_color,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_miles,
  classification_id
) {
  try {
    return await pool.query(
      "INSERT INTO public.inventory (inv_make, inv_model, inv_price, inv_color, inv_year, inv_description, inv_image, inv_thumbnail, inv_miles, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [inv_make, inv_model, inv_price, inv_color, inv_year, inv_description, inv_image, inv_thumbnail, inv_miles, classification_id]
    );
  } catch (error) {
    console.error("addInventory error " + error);
  }
}

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventory(
  inv_id,
) {
  try {
    const sql =
      "DELETE FROM public.inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [
      inv_id
    ])
    return data
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = {
  getClassifications,
  getInventoryById,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  checkExistingClassification,
  updateInventory,
  deleteInventory,
};
