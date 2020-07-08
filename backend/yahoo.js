const fetch = require('node-fetch');


const unixConvert = (unixTime) => {
    // console.log(unixTime.length)
    if (unixTime.length) {

        let dates = unixTime.map(x => new Date(x * 1000).toISOString())
        // console.log(dates)
        return dates

    } else {
        return new Date(unixTime * 1000).toISOString()
    }
}

const yahooAPI = async (link) => {
    const response = await fetch(link)
    data = await response.json()
    const chartedData = await data.chart.result

    return chartedData
}

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
    validGranularity = [
        "2m",
        "15m",
        "30m",
        "1h",
        "1d",
        "1wk",
        "1mo"
    ]

    if (validRanges.includes(range) == false) {
        throw new Error(`${range} is not a valid range: ${validRanges}`)
    }
    else if (validGranularity.includes(granularity) == false) {
        throw new Error(`${granularity} is not a valid range: ${validGranularity}`)
    }

    return `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?region=US&lang=en-US&includePrePost=false&interval=${granularity}&range=${range}&corsDomain=finance.yahoo.com&.tsrc=finance`
}

const getCurrentValue = async (ticker) => {
    let data = await yahooAPI(yahooLink(ticker, '1d', '1d'))
    return [data[0]['meta']['regularMarketPrice'], unixConvert(data[0]['meta']['regularMarketTime'])]
}

const getStockData = async (ticker, granularity, range, indicator, country) => {
    try {
        const res = await fetch(`https://services.dowjones.com/autocomplete/data?q=${ticker}&it=fund,exchangetradedfund,stock,Index,Currency,Benchmark,Future,Bond,CryptoCurrency&count=5&need=symbol,private-company,person,suggested-search-term,topic,omniture-keyword&excludeexs=XBAH,XCNQ,XTNX,XCYS,XCAI,XSTU,XBER,XHAN,XTAE,XAMM,XKAZ,XKUW,XCAS,XMUS,XKAR,DSMD,XMIC,RTSX,XSAU,XBRA,XCOL,XADS,XDFM,XCAR,XMSTAR,XOSE`)
        const tickerData = await res.json()
        // console.log(await tickerData)

        if (country && country != 'US') {
            // console.log('g')
            for (i = 0; i < tickerData['symbols'].length; i++) {

                if (tickerData['symbols'][i]['country'] == country.toUpperCase()) {
                    // console.log(tickerData['symbols'][i]['country'])
                    tickerChoice = i
                    if (tickerData['symbols'][i]['country'] == 'UK') {
                        ticker = ticker + '.L'

                    }
                }
            }
        } else {

            if (tickerData['symbols'][0]['country'] == 'UK') {
                ticker = ticker + '.L'

            }
            tickerChoice = 0
        }

        // console.log(tickerChoice)
        // console.log(tickerData['symbols'][tickerChoice])
        const data = await yahooAPI(yahooLink(ticker, granularity, range))
        // console.log(data)


        const timeStampData = unixConvert(await data[0]['timestamp'])

        if (data[0]['meta']['currency'] == 'GBp') {
            data[0]['meta']['currency'] = 'GBP'
            data[0]['indicators']['quote'][0][indicator] = data[0]['indicators']['quote'][0][indicator].map(x => x / 100)
            data[0]['meta']['regularMarketPrice'] = data[0]['meta']['regularMarketPrice'] / 100
        }

        const valueData = {}
        for (i = 0; i < timeStampData.length; i++) {
            if (data[0]['indicators']['quote'][0][indicator][i] == null) {

                data[0]['indicators']['quote'][0][indicator][i] = data[0]['indicators']['quote'][0][indicator][i - 1]
            }
            valueData[timeStampData[i]] = await data[0]['indicators']['quote'][0][indicator][i]

        }



        return {
            'name': tickerData['symbols'][tickerChoice]['company'], 'ticker': await data[0]['meta']['symbol'],
            'country': tickerData['symbols'][tickerChoice]['country'], 'currentValue': await data[0]['meta']['regularMarketPrice'].toFixed(2),
            'type': tickerData['symbols'][tickerChoice]['type'], 'currency': data[0]['meta']['currency'], 'valueData': valueData,
            'time': unixConvert(data[0]['timestamp'][data[0]['timestamp'].length - 1])
        }

    } catch{
        throw 'Could not gather stock data'
    }
}

module.exports.getStockData = getStockData