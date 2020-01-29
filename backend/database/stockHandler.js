
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const express = require('express');
const { pool } = require('./ServerSide/pool')
const apiGetters = require('./apiGetters')


const pgQuery = async (query, params) => {
    params = params || null
    try {
        const res = await pool.query(query, params)
        return res
    } catch (err) {
        console.log(err)
    }
}

// pgQuery(`SELECT time_series FROM (
//     SELECT jsonb_array_elements(data)AS "time_series" , id
//     FROM person 
//     WHERE id = 12
//         ) 
//     AS "unnested"
//     WHERE (time_series ->> 'time')::timestamp < current_timestamp;`
// )

const insertStock = async (ticker, name, fund, country) => {
    fund = fund || 'stock'
    country = country || 'USA'

    try {
        if (country == 'USA') {
            price = apiGetters.iexStock(ticker)
        } else {
            throw 'Stocks outside the US not yet supported!'
        }
        let dataValue = `'[]'::jsonb || jsonb_build_object('time',to_char(current_timestamp, 'YYYY-MM-DD HH24:MI:SS'),'price',${await price})`
        let params = [ticker, name, fund, country]
        let uploaded = pgQuery(`INSERT INTO stocks (ticker,name,fund,country,data) VALUES ($1,$2,$3,$4,${await dataValue})`, params) //add in response if price returns null values


    } catch (err) {
        console.log(err)
    }
}

const updateStock = async (ticker, country) => { //add in aftermarket hours support

    country = country || 'USA'
    try {
        if (country == 'USA') {
            price = apiGetters.iexStock(ticker)
        } else {
            throw 'Stocks outside the US not yet supported!'
        }
        let dataValue = `data || jsonb_build_object('time',to_char(current_timestamp, 'YYYY-MM-DD HH24:MI:SS'),'price',${await price})`

        let uploaded = pgQuery(`UPDATE stocks SET data = ${await dataValue} WHERE ticker = '${ticker}'`) //add in response if price returns null values
    } catch (err) {
        console.log(err)
    }
}

// setTimeoutupdateStock('tsla', 'Tesla', null, null)
// pgQuery("UPDATE stocks SET data = $1 WHERE ticker='test1'", [`jsonb_build_object('time',to_char(current_timestamp, 'YYYY-MM-DD HH24:MI:SS'))`]).then(data => console.log(data.rows))
// pgQuery("UPDATE stocks SET data =  data || jsonb_build_object('tife',to_char(current_timestamp, 'YYYY-MM-DD HH24:MI:SS'),'price',5)").then(res => console.log(res.rows))


const getCurrentValue = async (ticker, includeTime) => {  // gets latest object in db with matching ticker, use includeTime to include s
    try {
        let response = await pgQuery(`SELECT time_series FROM (
            SELECT jsonb_array_elements(data)AS "time_series" , ticker
            FROM stocks
            WHERE ticker = '${ticker}' AND data IS NOT NULL) 
            AS "unnested"`
            // WHERE (time_series->> 'time')::timestamp < current_timestamp;
        )
        const currentValue = await response.rows.slice(-1)[0].time_series

        if (typeof currentValue.price == 'number' && includeTime) {
            return currentValue
        } else if (typeof currentValue.price == 'number') {
            return currentValue.price
        } else {
            return 'Price not found!'
        }
    } catch (err) { console.log(err) }
}




const updateAll = async () => {

    try {
        const response = await pgQuery('SELECT ticker, country FROM stocks')
        response.rows.forEach(async ticker => {
            try {
                await updateStock(ticker.ticker, ticker.country)
            } catch (err) {
                console.log(err)
            }
        })
    }
    catch (err) {
        console.log(err)
    }
}

// wtdAPI(['aapl','twtr','vusa.l','jd.l','ocdo.l'])
// updateAll()

