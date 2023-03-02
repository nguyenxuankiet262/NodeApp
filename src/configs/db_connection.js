// get the client
const mysql = require('mysql2');
// create the connection to database

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'nodejs_basic',
});
const promisePool = pool.promise();

module.exports = promisePool;
