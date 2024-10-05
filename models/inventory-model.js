const pool = require("../database/");

async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

async function getInventoryById(id) {
  return await pool.query("SELECT * FROM public.inventory WHERE id = $1", [id]);
}

module.exports = {
  getClassifications,
  getInventoryById,
};
