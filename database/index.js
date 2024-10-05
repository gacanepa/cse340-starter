const { Pool } = require("pg")
require("dotenv").config()
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app but will cause problems in a production environment
 * If/else will determine which connection pool to use based on the environment
 * 
 * A connection pool is a cache of database connections maintained so that connections can be reused when
 * future requests to the database are required. Connection pools are used to enhance the performance of
 * executing commands on a database. They reduce the overhead of establishing a new connection every time
 * a database operation is performed.
 * *************** */
let pool;
if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      // Necessary for local testing when using self-signed certificates
      rejectUnauthorized: false,
    },
})

// Added for troubleshooting queries during development
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      console.log("executed query", { text });
      return res;
    } catch (error) {
      console.error("error in query", { text });
      throw error;
    }
  },
}
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  module.exports = pool;
}
