const { pool } = require('./pool')


const getPortfolio = async (id, currency) => {
    const params = [id, currency]
    const value = await pool.query(
        `SELECT ROUND(SUM(value * ((SELECT conversion FROM currency WHERE symbol = upper($2))/conversion)),2) total FROM 
        (SELECT id, stocks.ticker, quantity, price, quantity * price AS value, currency FROM
        (SELECT id ,upper(key) ticker, value::numeric quantity FROM
        (SELECT id, stocks_owned FROM users
        WHERE id = $1) AS userdata (id, data)
        JOIN jsonb_each_text(userdata.data) d ON TRUE) AS complete_data
        JOIN stocks ON stocks.ticker=complete_data.ticker) AS total_value
        JOIN currency on total_value.currency = currency.symbol`, params)
    return value.rows[0].total
}
// getPortfolio(1, 'GBP').then((data)=>console.log(data))

const getStocksOwned = async (id) => {
    try{
        params = [id]
        let data = await pool.query(`SELECT stocks_owned FROM users where id=$1`, params)
        return data.rows[0].stocks_owned
    }catch(err){
        return 'ERROR'
    }
}

const assignStock = async (user, ticker, quantity) => {
    try {
        params = [user, ticker, quantity]
        const res = await pool.query(`UPDATE users
                                SET stocks_owned = stocks_owned || jsonb_build_object($2::text,$3::numeric)
                                WHERE id = $1`, params
        )
    } catch (err) {
        console.log(err)
    }
}
assignStock(7,'TSLA',4)

const removeStock = async (user, ticker) => {
    try {
        params = [user, ticker.toUpperCase()]
        const res = await pool.query(`UPDATE users
                                SET stocks_owned = stocks_owned - $2
                                WHERE id = $1`,params)
        if (res.rowCount < 1){
            return('ERROR')
        }else{
            console.log(res.rowCount)
            return('SUCCESS')
        }
    } catch (err) {
        console.log(err)
    }
}
// assignStock(7,'tsla')
// removeStock(7,'tsla').then((data)=>console.log(data))



const assignMultipleStocks = async (user, tickersQuantity) => {
    Object.keys(tickersQuantity).map(key => {
        assignStock(user, key, tickersQuantity[key])
    })
}

// tickerQuantity = { 'TSLA': 9, 'GOOGL': 1, 'AAPL': 2, 'MSFT': 3, 'PYPL': 3, 'AMD': 6, 'DIS': 2, 'JD.L': 11, 'SNAP': 5, 'SXX.L': 100 }
// getStocksOwned(1).then(data => console.log(data))


module.exports.getPortfolio = getPortfolio
module.exports.getStocksOwned = getStocksOwned 