const { pool } = require('./pool')


const portfolioValue = async (id, currency) => {
    const params = [id, currency]
    const value = await pool.query(
        `SELECT ROUND(SUM(value * ((SELECT conversion FROM currency WHERE symbol = upper($2))/conversion)),2) total FROM 
        (SELECT id, stocks.ticker, quantity, price, quantity * price AS value, currency FROM
        (SELECT id ,upper(key) ticker, value::numeric quantity FROM
        (SELECT id, stocks_owned FROM users
        WHERE id = $1) AS userdata (id, data)
        JOIN jsonb_each_text(userdata.data) d ON TRUE) AS complete_data
        JOIN stocks ON stocks.ticker=complete_data.ticker) AS total_value
        JOIN currency on total_value.currency = currency.symbol`, params
    )
    return value.rows[0].total
}

portfolioValue(1, 'GBP').then(result => console.log(result))


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


const removeStock = async (user, ticker) => {
    try {
        const res = await pool.query(`UPDATE users
                                SET stocks_owned = stocks_owned - '${ticker}'
                                WHERE id = ${user}`)
        console.log(res)
    } catch (err) {
        console.log(err)
    }
}



const assignMultipleStocks = async (user, tickersQuantity) => {
    Object.keys(tickersQuantity).map(key => {
        assignStock(1, key, tickersQuantity[key])
    })
}

tickerQuantity = { 'TSLA': 9, 'GOOGL': 1, 'AAPL': 2, 'MSFT': 3, 'PYPL': 3, 'AMD': 6, 'DIS': 2, 'JD.L': 11, 'SNAP': 5, 'SXX.L': 100 }
// assignMultipleStocks(1, tickerQuantity)


