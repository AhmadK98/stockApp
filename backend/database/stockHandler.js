
const fetch = require('node-fetch')
const express = require('express');
const { pool } = require('./pool')
const apiGetters = require('../apiGetters')


const pgQuery = async (query, params) => {
    params = params || null
    try {
        const res = await pool.query(query, params)
        return res
    } catch (err) {
        return err
    }
}
// pgQuery('SELECT * FROM g').then(res => console.log(res))

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
            price = apiGetters.getIexStock(ticker)

        } else {
            throw 'Stocks outside the US not yet supported!'
        }
        let dataValue = `'[]'::jsonb || jsonb_build_object('time',to_char(current_timestamp, 'YYYY-MM-DD HH24:MI:SS'),'price',${await price})`
        let params = [ticker, name, fund, country, await price]
        let uploaded = pgQuery(`INSERT INTO stocks (
                                    ticker,
                                    name,
                                    fund,
                                    country,
                                    data, 
                                    price) 
                                VALUES (upper($1),$2,$3,$4,${await dataValue},$5)`, params) //add in response if price returns null values
    } catch (err) {
        console.log(err)
    }
}


const insertStockWtd = async (ticker, name, fund, country) => {
    fund = fund || 'stock'
    country = country || 'USA'

    try {
        if (country == 'UK') {
            // ticker = ticker + '.L'
            
            stock = (await apiGetters.wtdAPI(ticker))[0]
            console.log(stock)

        } else {
            
            stock = (await apiGetters.wtdAPI(ticker))[0]
            
        }
        let dataValue = `'[]'::jsonb || jsonb_build_object('time',to_char(current_timestamp, 'YYYY-MM-DD HH24:MI:SS'),'price',${await stock.price})`
        let params = [await stock.symbol, await stock.name, fund, country, await stock.price, await stock.currency]
        console.log(params)
        let uploaded = await pgQuery(`INSERT INTO stocks (
                                    ticker,
                                    name,
                                    fund,
                                    country,
                                    data, 
                                    price,
                                    currency) 
                                VALUES (upper($1),$2,$3,$4,${await dataValue},$5, $6)`, params)
                                
         //add in response if price returns null values
    } catch (err) {
        console.log(err)
    }
}
insertStockWtd(['VUSA.L'],'Vanguard',null,'UK')

const updateStock = async (ticker, country) => { //only updates US stocks ATM

    country = country || 'USA'
    try {
        if (country == 'USA') {
            price = await apiGetters.getIexStock(ticker)
        } else {
            throw 'Stocks outside the US not yet supported!'
        }
        let receivedPrice = await price
        let dataValue = `data || jsonb_build_object('time',to_char(current_timestamp, 'YYYY-MM-DD HH24:MI:SS'),'price',${await price})`


        let uploaded = pgQuery(`UPDATE stocks 
                                SET price = ${await receivedPrice}, data = ${dataValue}
                                WHERE ticker = '${ticker}'`) //add in response if price returns null values
    } catch (err) {
        
        if (err.errno == 'ECONNREFUSED'){
            return `Can't connect` //change this!!
        }else{
            return err
        }
        
    }
}

// setTimeoutupdateStock('tsla', 'Tesla', null, null)
// pgQuery("UPDATE stocks SET data = $1 WHERE ticker='test1'", [`jsonb_build_objsect('time',to_char(current_timestamp, 'YYYY-MM-DD HH24:MI:SS'))`]).then(data => console.log(data.rows))
// pgQuery("UPDATE stocks SET data =  data || jsonb_build_object('tife',to_char(current_timestamp, 'YYYY-MM-DD HH24:MI:SS'),'price',5)").then(res => console.log(res.rows))


const getCurrentValue = async (ticker, includeTime) => {  // gets latest object in db with matching ticker, use includeTime to include s
    try {
        let response = await pgQuery(`SELECT time_series FROM (
            SELECT jsonb_array_elements(data)AS "time_series" , ticker
            FROM stocks
            WHERE ticker = upper('${ticker}') AND data IS NOT NULL) 
            AS "unnested"`
            // WHERE (time_series->> 'time')::timestamp < current_timestamp;
        )

        let data
        try {
            data = await response.rows.slice(-1)[0].time_series
        } catch {
            data = response
        }

        if (typeof data.price == 'number' && includeTime) {
            return data
        } else if (typeof data.price == 'number') {
            return data.price
        } else {
            throw data
        }
    
    } catch (err) { 
        
        if (err.errno !== undefined && (err.errno === 'ECONNREFUSED' || err.errno === 'ENOTFOUND')){
            return `Can't connect to database`
        }else{
            return `Can't find stock`
        }}
}

// const updateAll = async () => {

//     try {
//         const response = await pgQuery('SELECT ticker, country FROM stocks')
//         await response.rows.forEach(async ticker => {
//             try {
//                 await updateStock(ticker.ticker, ticker.country)
//             } catch (err) {
//                 console.log(err)
//             }
//         })
//     }
//     catch (err) {
//         console.log(err)
//     }
// }

const updateAllWtd = async () => {
    tickers = []
    try {
        const response = await pgQuery('SELECT ticker, country FROM stocks')

        await response.rows.forEach(object => {
            tickers.push(object.ticker)

        })
        const apiData = await apiGetters.wtdAPI(await tickers)
        apiData.forEach(stock => {

            let dataValue = `data || jsonb_build_object('time',to_char(current_timestamp, 'YYYY-MM-DD HH24:MI:SS'),'price',${stock.price})`
            let uploaded = pgQuery(`UPDATE stocks 
                                    SET price = ${stock.price}, data = ${dataValue}, currency = '${stock.currency}'
                                    WHERE ticker = '${stock.symbol}'`) //add in response if price returns null values

        })
    }
    catch (err) {
        console.log(err)
    }
}



// wtdAPI(['aapl','twtr','vusa.l','jd.l','ocdo.l'])
// insertStock('MSFT', 'Microsoft', null, null)
// updateAllWtd()


module.exports.getCurrentValue = getCurrentValue

// SELECT SUM(stockvalue) FROM
// (SELECT id, ticker, value::numeric, price, price*value::numeric AS stockvalue FROM(
// SELECT * FROM
// (SELECT username, stocks_owned FROM users
// WHERE id = 1) AS q (id, data)
// JOIN jsonb_each_text(q.data) d ON TRUE) as keyvalue
// JOIN stocks ON stocks.ticker=keyvalue.key) AS g

//next steps:

//cookies
//forex
//total vlaue
//frontend!!!