const fetch = require('node-fetch');

fetch(`https://api.wsj.net/api/michelangelo/timeseries/history?json=%7B%22Step%22%3A%22PT5M%22%2C%22TimeFrame%22%3A%22D5%22%2C%22EntitlementToken%22%3A%2257494d5ed7ad44af85bc59a51dd87c90%22%2C%22IncludeMockTick%22%3Atrue%2C%22FilterNullSlots%22%3Afalse%2C%22FilterClosedPoints%22%3Atrue%2C%22IncludeClosedSlots%22%3Afalse%2C%22IncludeOfficialClose%22%3Atrue%2C%22InjectOpen%22%3Afalse%2C%22ShowPreMarket%22%3Afalse%2C%22ShowAfterHours%22%3Afalse%2C%22UseExtendedTimeFrame%22%3Atrue%2C%22WantPriorClose%22%3Atrue%2C%22IncludeCurrentQuotes%22%3Afalse%2C%22ResetTodaysAfterHoursPercentChange%22%3Afalse%2C%22Series%22%3A%5B%7B%22Key%22%3A%22FUND%2FUK%2FXLON%2FVUSA%22%2C%22Dialect%22%3A%22Charting%22%2C%22Kind%22%3A%22Ticker%22%2C%22SeriesId%22%3A%22s1%22%2C%22DataTypes%22%3A%5B%22Last%22%5D%7D%5D%7D&ckey=57494d5ed7
`, {
    headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'Connection': 'keep-alive',
        'DNT': '1',
        'Dylan2010.EntitlementToken': '57494d5ed7ad44af85bc59a51dd87c90',
        'Host': 'api.wsj.net',
        'Origin': 'https://www.wsj.com',
        'Referer': 'https://www.wsj.com/market-data/quotes/TSLA?mod=searchresults_companyquotes',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Mobile Safari/537.36',
    }
}
).then((data) => { return data.json() }).then((data => console.log(data)))