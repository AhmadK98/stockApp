const { pool } = require('./pool')

const pgQuery = async (query, params) => { // send requests to db
    params = params || null
    try {
        const res = await pool.query(query, params)
        return res
    } catch (err) {
        return err
    }
}

const noOfStocks = async () => {
    let data = await pgQuery(`SELECT COUNT(ticker) FROM stocks`)
    return data.rows[0]['count']
}

const marketHours = () => {
    data = {}
    currentTime = new Date()
    if (currentTime.getHours() >= 8 && currentTime.getHours() <= 16) {
        if (currentTime.getHours() == 16 && currentTime.getMinutes() < 30) {
            data['UKMarket'] = 'open'
        } else {
            data['UKMarket'] = 'closed'
        }
        data['UKMarket'] = 'open'
    } else {
        data['UKMarket'] = 'closed'
    }

    if (currentTime.getHours() >= 14 && currentTime.getHours() < 21) {
        if (currentTime.getHours() == 14 && currentTime.getMinutes() > 30) {
            data['USMarket'] = 'open'
        } else {
            data['USMarket'] = 'closed'
        }
        data['USMarket'] = 'open'
    } else {
        data['USMarket'] = 'closed'
    }

    return data
}



