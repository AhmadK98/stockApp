const fetch = require('node-fetch')
const express = require('express');
const { pool } = require('./pool')
const apiGetters = require('../apiGetters')

// console.log('g')
const pgQuery = async (query, params) => {
    params = params || null
    try {
        const res = await pool.query(query, params)
        return res
    } catch (err) {
        return err
    }
}

const insertStockWtdNew = async (ticker, name, fund, country) => {
    fund = fund || 'stock'
    country = country || 'USA'
    
    try {
        if (country == 'UK') {
            ticker[0] = ticker[0] + '.L'   
        }
        let params = [ticker[0]]
        let check = await pgQuery(`SELECT * FROM stocks_new WHERE ticker = $1`, params)
        if (check.rowCount == 0) {
        stock = (await apiGetters.wtdApi(ticker))[0]
        
        if (stock.currency == 'GBX') {
            stock.currency = 'GBP'
            stock.price = stock.price / 100
        }
        let dataValue = `'[]'::jsonb || jsonb_build_object(current_timestamp,${await stock.price})`
        params = [await stock.symbol, await stock.name, fund, country, await stock.price, await stock.currency]
        let uploaded = await pgQuery(`INSERT INTO stocks_new (
                                    ticker,
                                    name,
                                    fund,
                                    country,
                                    data, 
                                    price,
                                    currency) 
                                VALUES (upper($1),$2,$3,$4,${await dataValue},$5, $6)`, params)

        }//add in response if price returns null values
    } catch (err) {
        console.log(err)
    }
}



// insertStockWtdNew(['AMZN'], 'AMD', 'stock', 'USA')


const insertHistory = async (ticker) => {

        let params = [ticker]
        let currency = await pgQuery('SELECT currency FROM stocks_new WHERE ticker=upper($1)',params)
        let historicalData = await apiGetters.wtdHistory(ticker)
        let queries = []
        let query
        let price
        await Object.keys(historicalData).forEach(time => {
            
            price = historicalData[time]
            
            
            if (currency.rows[0]['currency']== 'GBP') { 
                price.close = Math.round(price.close) / 100

            }
            // console.log(price.close)
            let dataValue = `data || jsonb_build_object(to_timestamp('${time}', 'YYYY-MM-DD'),${price.close})`
            query = `UPDATE stocks_new SET price = ${price.close}, data = ${dataValue}, currency = '${currency.rows[0]['currency']}' WHERE ticker = '${ticker}'`
            queries.push(query)
        })
        pgQuery(queries.join(';')).then((data)=>console.log(data))
}


const getAllHistoricValue = async (ticker, includeTime, from, to) => {  //all prices within a range

    try {
        try {
            fromDate = from ? new Date(from).toISOString() : new Date('1950').toISOString() // range
            toDate = to ? new Date(to).toISOString() : 'current_timestamp'

        } catch (err) {
            throw 'Invalid date format'
        }
        let response = await pgQuery(`SELECT time_series FROM (
            SELECT jsonb_array_elements(data)AS "time_series" , ticker
            FROM stocks
            WHERE ticker = upper('${ticker}') AND data IS NOT NULL) 
            AS "unnested"
            WHERE (time_series->> 'time')::timestamp < '${toDate}' AND (time_series->> 'time')::timestamp > '${fromDate}'`
        )
        let data
        try {
            // data = await response.rows.slice(-1)[0].time_series
            data = await response.rows
        } catch {
            data = response
        }
        return [data, { 'range': { 'from': fromDate, 'to': toDate } }]//throw

    } catch (err) {
        if (err.errno !== undefined && (err.errno === 'ECONNREFUSED' || err.errno === 'ENOTFOUND')) {
            return `Can't connect to database`
        } else {
            return err
        }
    }
}

const getAllHistoricValueNew = async (ticker, includeTime, from, to) => {  //all prices within a range

    `SELECT d.key, d.value from
    (SELECT data FROM stocks_new WHERE ticker='VUSA.L') q
    JOIN jsonb_each_text(q.data) d ON true
    WHERE key::timestamp > to_timestamp('2013-05-02','YYYY-MM-DD') and  key::timestamp < to_timestamp('2014-05-02','YYYY-MM-DD')`
}



const getOneHistoricValue = async (ticker, includeTime, from, to) => { //gets closing price stock of each day within the range

    try {
        try {
            fromDate = from ? new Date(from).toISOString() : new Date('1950').toISOString()
            toDate = to ? new Date(to).toISOString() : 'current_timestamp'

        } catch (err) {
            throw 'Invalid date format'
        }
        params = [ticker, toDate]
        let response = await pgQuery(`
                                SELECT * FROM (
                                    SELECT time_series FROM (
                                        SELECT time_series FROM 
                                            (SELECT jsonb_array_elements(data)AS "time_series" , ticker
                                                FROM stocks
                                                WHERE ticker = upper($1) AND data IS NOT NULL)
                                                AS stock_data ) AS a
                                    JOIN 
                                    (SELECT MAX(g.time_series->>'time') AS date FROM (
                                        SELECT to_char(to_timestamp(stock_data.time_series->> 'time', 'YYYY-MM-DD HH24:MI:SS'),'YYYY-MM-DD') date, time_series 
                                        FROM (
                                            SELECT jsonb_array_elements(data)AS "time_series" , ticker
                                            FROM stocks
                                            WHERE ticker = upper($1) AND data IS NOT NULL) 
                                            AS stock_data) AS g
                                        GROUP BY date) as b
                                    ON a.time_series->>'time'=b.date) as c
                                WHERE (time_series->>'time')::timestamp < $2::timestamp`, params)
        let data
        try {
            // data = await response.rows.slice(-1)[0].time_series
            data = await response.rows
        } catch {
            data = response
        }
        return [data, { 'range': { 'from': fromDate, 'to': toDate } }]//throw

    } catch (err) {
        if (err.errno !== undefined && (err.errno === 'ECONNREFUSED' || err.errno === 'ENOTFOUND')) {
            return `Can't connect to database`
        } else {
            return err
        }
    }
}



const getCurrentValue = async (ticker, includeTime) => {  //gets current value, should change to current price column
    try {
        let response = await pgQuery(`SELECT time_series FROM (
            SELECT jsonb_array_elements(data)AS "time_series" , ticker
            FROM stocks
            WHERE ticker = upper('${ticker}') AND data IS NOT NULL) 
            AS "unnested"
            WHERE (time_series->> 'time')::timestamp < current_timestamp`
        )

        let data
        try {
            data = await response.rows.slice(-1)[0].time_series
            // data = await response.rows
        } catch {
            data = response
        }

        if (typeof data.price == 'number' && includeTime) {
            return data
        } else if (typeof data.price == 'number') {
            return data.price
        } else {
            throw data //throw
        }

    } catch (err) {

        if (err.errno !== undefined && (err.errno === 'ECONNREFUSED' || err.errno === 'ENOTFOUND')) {
            return `Can't connect to database`
        } else {
            return `Can't find stock`
        }
    }
}

// getLastUpdated(ticker) = async () => {

// }

// getOneHistoricValue('SXX.L', true, '2010-01','2020-04').then((data)=>console.log(data[0]))


const updateAllWtdNew = async () => {//updates prices of all stocks, creates links split by limit of api call and updates each stock entry with time and price
    tickers = []
    console.log('WE UPDATING')
    try {
        const response = await pgQuery('SELECT ticker, country FROM stocks_new')
        await response.rows.forEach(object => {
            tickers.push(object.ticker)
        })

        const links = await apiGetters.wtdApiCreateLinks(await tickers)
        links.forEach(async link => {
            stock = await apiGetters.wtdApiUseLinks(link)
            await stock.forEach(stock => {
                if (stock.currency == 'GBX') {
                    stock.currency = 'GBP'
                    stock.price = Math.round(stock.price) / 100
                }
                let dataValue = `data || jsonb_build_object(to_timestamp('${stock.last_trade_time}', 'YYYY-MM-DD HH24:MI:SS'),${stock.price})` //use last trade time
                let uploaded = pgQuery(`UPDATE stocks_new 
                                        SET price = ${stock.price}, data = ${dataValue}, currency = '${stock.currency}'
                                        WHERE ticker = '${stock.symbol}'`) //safe to use without params because of restricted variables
            })
        })
    }
    catch (err) {
        console.log(err)
    }
}
// updateAllWtdNew()

// insertStockWtdNew(['TSCO'],null, 'stock','UK')
// module.exports.getCurrentValue = getCurrentValue

// SELECT SUM(stockvalue) FROM
// (SELECT id, ticker, value::numeric, price, price*value::numeric AS stockvalue FROM(
// SELECT * FRO
// (SELECT username, stocks_owned FROM users
// WHERE id = 1) AS q (id, data)
// JOIN jsonb_each_text(q.data) d ON TRUE) as keyvalue
// JOIN stocks ON stocks.ticker=keyvalue.key) AS g

//next steps:
// insertHistory('AMZN')