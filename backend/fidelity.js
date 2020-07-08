const fetch = require('node-fetch');

const fidelityAPI = async (link) => {
    const res = await fetch(link)
    const data = await res.text()
    const dataString = await data.toString()

    const jsonIndex = await dataString.indexOf('{')
    const jsonString = await dataString.slice(jsonIndex, (dataString.length - 1))



    return JSON.parse(jsonString)
}



'https://fastquote.fidelity.com/service/quote/nondisplay/json?productid=research&symbols=TSLA&quotetype=D&callback=jQuery111108759625421785682_1594213498918&_=1594213498919'

const fidelityLink = (ticker, from, to, intraday, granularity, incExtendedHours) => {
    //intraday: 1 = 1min 2 = 3min 3 = 5mins 4 = 10 mins 5 = 15 mins 6 = 30 mins 7 = 1 hour 8 = 1.5 hours
    // 1 = 1d 2 = 1wk 3 = 1mo 4 = 3mo 5 = 1yr


    link = `https://fastquote.fidelity.com/service/historical/chart/lite/json?productid=research&symbols=${ticker}&dateMin=${from}&dateMax=${to}&intraday=${intraday}&granularity=${granularity}&incextendedhours=${incExtendedHours}&dd=y&callback=jQuery111107214907313877477_1594174076809&_=1594174076814`

    return link

}





const fidelityInfo = async (ticker) => {
    data = await fidelityAPI(`https://fastquote.fidelity.com/service/quote/nondisplay/json?productid=research&symbols=${ticker}&quotetype=D&callback=jQuery111108759625421785682_1594213498918&_=1594213498919`)
    return data['QUOTE']
}

const fidelityData = async (ticker, from, to, intraday, granularity, incExtendedHours) => {
    data = await fidelityAPI(fidelityLink(ticker, from, to, intraday, granularity, incExtendedHours))
    return data['SYMBOL'][0]['BARS']['CB']
}
// fidelityInfo('TSLA').then(data => console.log(data))

fidelityData('TSLA', '2020-07-08', '2020-07-09', 'y', '1', 'n').then(data => console.log(data))