const fetch = require('node-fetch');


const unixConvert = (unixTime) => {
    // console.log(unixTime.length)
    if (unixTime.length) {

        let dates = unixTime.map(x => new Date(x * 1000))
        // console.log(dates)
        return dates

    } else {
        return new Date(unixTime * 1000)
    }
}




const yahooAPI = async (link) => {
    const response = await fetch(link)
    data = await response.json()
    const chartedData = await data.chart.result

    return chartedData
}

// yahooAPI('https://query1.finance.yahoo.com/v8/finance/chart/MSFT?region=US&lang=en-US&includePrePost=false&interval=1wk&range=1y&corsDomain=finance.yahoo.com&.tsrc=finance').then(data => console.log(data))

const yahooLink = (ticker, granularity, range) => {

    validRanges = [
        "1d",
        "5d",
        "1mo",
        "3mo",
        "6mo",
        "1y",
        "2y",
        "5y",
        "10y",
        "ytd",
        "max"]

    if (validRanges.includes(range) == false) {
        throw new Error(`${range} is not a valid range: ${validRanges}`)
    }
    return `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?region=US&lang=en-US&includePrePost=false&interval=${granularity}&range=${range}&corsDomain=finance.yahoo.com&.tsrc=finance`
}
// yahooAPI(yahooLink('TSLA', '1d', '5d')).then(data => console.log(data[0]['indicators']['quote']))

const getCurrentValue = async (ticker) => {
    let data = await yahooAPI(yahooLink(ticker, '1d', '1d'))
    return [data[0]['meta']['regularMarketPrice'], unixConvert(data[0]['meta']['regularMarketTime'])]
}

// getCurrentValue('VUSA.L').then(data => console.log(data))
// console.log(unixConvert(1593633601))



// yahooAPI(yahooLink('TSLA', '1d', '5d')).then(data => {

//     unixConvert(data[0]['timestamp'])
// })

const getStockData = async (ticker, granularity, range, indicator) => {
    const data = await yahooAPI(yahooLink(ticker, granularity, range))
    return {
        'timestamp': unixConvert(await data[0]['timestamp']), 'values': await data[0]['indicators']['quote'][0][indicator]
    }
}


// getStockData('TSCO.L', '15m', '1d', 'open').then(data => console.log(data))
getCurrentValue('TSCO.L').then(data => console.log(data))