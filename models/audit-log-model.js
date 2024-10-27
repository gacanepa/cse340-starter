const pool = require("../database/");

async function getAuditLog () {
  try {
    const result = await pool.query(
      'SELECT al.audit_action, al.audit_table, al.audit_timestamp, inv.inv_make || \' \' || inv.inv_model AS item FROM audit_log al LEFT JOIN inventory inv ON al.item_id = inv.inv_id ORDER BY al.audit_timestamp DESC LIMIT 10',
      [])
    return result.rows
  } catch (error) {
    return new Error("An error occurred")
  }
}

module.exports = {
  getAuditLog
};
