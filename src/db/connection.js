const Pool = require('pg').Pool
const pool = new Pool({
    user: 'root',
    host: 'localhost',
    database: 'revie',
    password: '12345!@#$%',
    port: 5432,
})

module.exports = pool