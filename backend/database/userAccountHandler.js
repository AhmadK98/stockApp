const { pool } = require('./pool')
const bcrypt = require('bcrypt')


const updateLastLoggedIn = async (id) => {
    try {
        pool.query(`UPDATE users
                SET last_logged_in = current_timestamp
                WHERE id = ${id};`
        )
    } catch (err) {
        console.log(err)
    }
}

const addUser = async (username, password, email) => {
    const params = [username, password, email]
    try {
        const res = await pool.query(`INSERT INTO users (
                                  username,
                                  password,
                                  email,
                                  createdat)
                                  VALUES ($1,$2,$3,current_timestamp)`, params)
        return 'Created user'
    } catch (err) {
        console.log(err)
        if (err.code == 23505) {
            return `${err.constraint.split('_')[1]} already exists`
        } else {
            return err
        }
    }
}

const getUser = async (username, email, password) => {
    let userData
    try {
        if (username) {
            userData = await pool.query(`SELECT * FROM users where username = '${username}'`)
        } else if (email) {
            userData = await pool.query(`SELECT * FROM users where email = '${email}'`)
        }
        if (userData.rowCount == 0) {
            return 'Email or Password is incorrect, please try again'
        }

        const verifyPassword = await bcrypt.compare(password, await userData.rows[0].password)
        if (verifyPassword) {
            await updateLastLoggedIn(userData.rows[0].id)
            return { userdata: userData.rows[0], login: 'Logged in!' }

        } else {
            return 'Email or Password is incorrect, please try again'
        }
    } catch (err) {
        console.log(err)
    }
}



// .then(data => console.log(data.rows))
const assignStock = async (user, ticker, quantity) => {
    params = [user, ticker, quantity]
    try {
        const res = await pool.query(`UPDATE users
                                SET stocks_owned = stocks_owned || jsonb_build_object($2::text,$3::numeric)
                                WHERE id = $1`, params
        )
    } catch (err) {
        console.log(err)
    }
}
// assignStock(1,'aapl',4)
const removeStock = async (user, ticker) => {
    params = [user, ticker]
    try {
        const res = await pool.query(`UPDATE users
                                SET stocks_owned = stocks_owned - $2::numeric
                                WHERE id = $1`)
    } catch (err) {
        console.log(err)
    }
}




module.exports.addUser = addUser

module.exports.getUser = getUser