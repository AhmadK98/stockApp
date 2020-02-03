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
            return 'ERROR IN CREATION PROCESS'
        }
    }
}

const getUser = async (user, password) => {
    let userData
    let params = [user]
    try {
        if (!user.match(/[!@|[€£:;><§}{~ `'"#\$%\?\^\&*\)\(+=._-]/g)) {
            userData = await pool.query(`SELECT * FROM users where username = $1`, params)
        } else {
            userData = await pool.query(`SELECT * FROM users where email = $1`, params)
        }
        if (userData.rowCount == 0) {
            throw 'Username/Email or Password is incorrect, please try again'
        }

        const verifyPassword = await bcrypt.compare(password, await userData.rows[0].password)
        if (verifyPassword) {
            
            await updateLastLoggedIn(userData.rows[0].id)
            
            return { userdata: userData.rows[0], login: true }

        } else {
            throw 'Username/Email or Password is incorrect, please try again'
        }
    } catch (err) {
        return err
    }
}








module.exports.addUser = addUser

module.exports.getUser = getUser