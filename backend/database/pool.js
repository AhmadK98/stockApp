require('dotenv').config()
const { Pool } = require('pg')


const pool = new Pool({
    user: 'postgres',
    host: 'stocks.c0dnmwizfrju.eu-west-2.rds.amazonaws.com',
    port: 5432,
    database: "postgres",
    password: 'X4nd32k1'
})
// const g = process.env.DB_PASSWORD
// console.log(g)
// pool.query('SELECT * FROM stocks').then(data => console.log(data))
module.exports.pool = pool