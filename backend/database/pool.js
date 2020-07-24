require('dotenv').config()
const { Pool } = require('pg')

console.log()
const pool = new Pool({
   
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})
// const g = process.env.DB_PASSWORD
// console.log(g)
// pool.query('SELECT * FROM stocks').then(data => console.log(data))
module.exports.pool = pool