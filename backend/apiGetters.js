const fetch = require('node-fetch');
// const cheerio = require('cheerio')


//scrapes live price from marketwatch, not very good, only seems to work a few times before it gets blocked
// async function webScrape(ticker, fund, country) {
//     //https://cors-anywhere.herokuapp.com/
//     let link = ''
//     if (typeof fund === 'undefined' && typeof country === 'undefined') {
//         link = link.concat(`https://www.marketwatch.com/investing/stock/${ticker}`)
//     }
//     else if (typeof fund !== 'undefined' && typeof country === 'undefined') {
//         link = `https://www.marketwatch.com/investing/fund/${ticker}`
//     }
//     else if (typeof fund === 'undefined' && typeof country !== 'undefined') {
//         link = `https://www.marketwatch.com/investing/stock/${ticker}?countrycode=${country}`
//     }
//     else {
//         link = `https://www.marketwatch.com/investing/fund/${ticker}?countrycode=${country}`
//     }


//     let res = await fetch(link)
//     let $ = cheerio.load(await res.text())
//     cont = await $('.value').html()

//     return (cont)

// }

//gets stock from IEX, only supports US stocks
const getIexStock = async (ticker) => {
    apiLink = `https://cloud.iexapis.com/v1/stock/${ticker}/quote/?token=pk_96f79a2fd819415ab4ebf222f055de7a`

    try {
        let response = await fetch(apiLink)
        data = await (response.json())

        return data.latestPrice
    } catch (err) {
        console.log(err.message)
    }
}

const wtdApi = async (tickers) => {
    const numLoops = tickers.length / 5
    const remainder = tickers.length % 5
    const links = []
    apiKey = 'UsQhjjiFOodsCYt8eWSmRqY7qquA9yqlH2A9uhqv1UvotS00D6AqSeBg8VVf'
    console.log('CHANGE THIS APIGETTERS.js')
    for (i = 0; i < numLoops; i++) {
        let tickersFive = (tickers.slice(i * 5, i * 5 + 5))
        link = `https://api.worldtradingdata.com/api/v1/stock?symbol=${tickersFive.toString()}&api_token=${apiKey}`
        links.push(link)
    }
    try {
        res = await fetch(link)
        apiData = await res.json()
        return apiData.data
    } catch (err) {
        console.log(err)
    }
}


// wtdApi(['ZM']).then((data) => console.log(data))

const wtdApiCreateLinks = (tickers) => {
    const numLoops = tickers.length / 5
    const remainder = tickers.length % 5
    const links = []
    apiKey = 'UsQhjjiFOodsCYt8eWSmRqY7qquA9yqlH2A9uhqv1UvotS00D6AqSeBg8VVf'
    for (i = 0; i < numLoops; i++) {
        let tickersFive = (tickers.slice(i * 5, i * 5 + 5))
        link = `https://api.worldtradingdata.com/api/v1/stock?symbol=${tickersFive.toString()}&api_token=${apiKey}`
        links.push(link)
    }
    return links
}
const wtdApiUseLinks = async (link) => {
    try {
        res = await fetch(link)
        apiData = await res.json()
        return apiData.data
    } catch (err) {
        console.log(err)
    }
}
// wtdApiUseLinks(wtdApiCreateLinks(['TSCO.L'])).then((data) => console.log(data))

const wtdHistory = async (ticker) => {
    const url = new URL(
        "https://api.worldtradingdata.com/api/v1/history"
    );

    let params = {
        "symbol": `${ticker}`,
        "api_token": "UsQhjjiFOodsCYt8eWSmRqY7qquA9yqlH2A9uhqv1UvotS00D6AqSeBg8VVf",
    };

    Object.keys(params)
        .forEach(key => url.searchParams.append(key, params[key]))

    try {
        res = await fetch(url)
        // console.log(ticker)
        data = await res.json()
        // console.log(data)
        return data.history

    } catch (err) {
        console.log(err)
    }
}

// wtdHistory('AAPL').then(data => console.log(data))
// wtdApiUseLinks('https://api.worldtradingdata.com/api/v1/stock?symbol=TSLA&api_token=UsQhjjiFOodsCYt8eWSmRqY7qquA9yqlH2A9uhqv1UvotS00D6AqSeBg8VVf')
//     .then(data => console.log(data))
// a = wtdApiLinks(['TSLA', 'GOOGL', 'AAPL', 'MSFT', 'PYPL', 'AMD', 'DIS', 'JD.L', 'SNAP', 'SXX.L', 'A'])

// wtdAPI(['vusa.l']).then(data => console.log(data))

const forex = async (base, convertTo) => {
    let link
    if (convertTo) {
        link = `https://api.worldtradingdata.com/api/v1/forex?base=${base}&convert_to=${convertTo}&api_token=UsQhjjiFOodsCYt8eWSmRqY7qquA9yqlH2A9uhqv1UvotS00D6AqSeBg8VVf`
    } else {
        link = `https://api.worldtradingdata.com/api/v1/forex?base=${base}&api_token=UsQhjjiFOodsCYt8eWSmRqY7qquA9yqlH2A9uhqv1UvotS00D6AqSeBg8VVf`
    }
    try {
        const res = await fetch(link)
        const data = await res.json().then(dataa => console.log(dataa)) // currently logs forex, should return to be used
    } catch (err) {
        console.log(err)
    }

}



module.exports.forex = forex

module.exports.wtdApi = wtdApi
module.exports.getIexStock = getIexStock
module.exports.wtdApiCreateLinks = wtdApiCreateLinks
module.exports.wtdApiUseLinks = wtdApiUseLinks
module.exports.wtdHistory = wtdHistory

// module.exports.mkWatch = webScrape