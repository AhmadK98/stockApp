require('dotenv').config()
const { Pool } = require('pg')


const pool = new Pool({
    user: process.env.db_user,
    password: process.env.db_password,
    host: process.env.db_host,
    port: 5432,
    database: "postgres"
})


module.exports.pool = pool