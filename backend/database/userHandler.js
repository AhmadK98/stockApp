const { pool } = require('./ServerSide/pool')

const addUser = async (username, password, email) => {
    const params = [username, password, email]
    try {
        const res = await pool.query(`INSERT INTO users (
                                  username,
                                  password,
                                  email,
                                  createdat)
                                  VALUES ($1,$2,$3,current_timestamp)`, params)

    } catch (err) {
        if (err.code == 23505) {
            console.log('User already exits')
        }
    }
}

const assignStock = async (user, ticker, quantity) => {
    try {
        const res = await pool.query(`UPDATE users
                                SET stocks_owned = stocks_owned || jsonb_build_object('${ticker}',${quantity})
                                WHERE id = ${user}`
        )
    } catch (err) {
        console.log(err)
    }
}

const removeStock = async (user, ticker) => {
    try {
        const res = await pool.query(`UPDATE users
                                SET stocks_owned = stocks_owned - '${ticker}'
                                WHERE id = ${user}`)
    } catch (err) {
        console.log(err)
    }
}


module.exports.addUser = addUser
module.exports.assignStock = assignStock
module.exports.removeStock = removeStock