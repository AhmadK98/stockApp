const fetch = require("node-fetch");

fetch('https://services.dowjones.com/autocomplete/data?q=vusa&it=fund,exchangetradedfund,stock,Index,Currency,Benchmark,Future,Bond,CryptoCurrency&count=5&need=symbol,private-company&excludeexs=XBAH,XCNQ,XTNX,XCYS,XCAI,XSTU,XBER,XHAN,XTAE,XAMM,XKAZ,XKUW,XCAS,XMUS,XKAR,DSMD,XMIC,RTSX,XSAU,XBRA,XCOL,XADS,XDFM,XCAR,XMSTAR,XOSE',{
    headers: {
        'Accept': 'application/json',
        // 'Origin': 'https://www.wsj.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Host': 'services.dowjones.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Safari/605.1.15',
        'Accept-Language': 'en-gb',
        // 'Referer': 'https://www.wsj.com/',
        'Connection': 'keep-alive',
    }
}).then(async (data)=>{
    
    console.log(await data.json())
})