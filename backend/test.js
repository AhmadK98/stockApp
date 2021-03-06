const a = [
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        currency: 'USD',
        price: '324.34',
        price_open: '324.45',
        day_high: '327.85',
        day_low: '321.38',
        '52_week_high': '327.85',
        '52_week_low': '160.23',
        day_change: '6.65',
        change_pct: '2.09',
        close_yesterday: '317.69',
        market_cap: '1421916372992',
        volume: '53002777',
        volume_avg: '32771333',
        shares: '4384030208',
        stock_exchange_long: 'NASDAQ Stock Exchange',
        stock_exchange_short: 'NASDAQ',
        timezone: 'EST',
        timezone_name: 'America/New_York',
        gmt_offset: '-18000',
        last_trade_time: '2020-01-29 16:00:01',
        pe: '25.75',
        eps: '12.60'
    },
    {
        symbol: 'JD.L',
        name: 'JD Sports Fashion PLC',
        currency: 'GBX',
        price: '826.20',
        price_open: '834.20',
        day_high: '836.60',
        day_low: '820.40',
        '52_week_high': '890.00',
        '52_week_low': '436.50',
        day_change: '-6.80',
        change_pct: '-0.82',
        close_yesterday: '833.00',
        market_cap: '8040852486',
        volume: '1106609',
        volume_avg: '1920477',
        shares: '973233160',
        stock_exchange_long: 'London Stock Exchange',
        stock_exchange_short: 'LSE',
        timezone: 'GMT',
        timezone_name: 'Europe/London',
        gmt_offset: '0',
        last_trade_time: '2020-01-29 16:44:21',
        pe: '31.15',
        eps: '0.27'
    },
    {
        symbol: 'OCDO.L',
        name: 'Ocado Group PLC',
        currency: 'GBX',
        price: '1292.50',
        price_open: '1311.50',
        day_high: '1318.50',
        day_low: '1290.00',
        '52_week_high': '1440.50',
        '52_week_low': '836.40',
        day_change: '-15.00',
        change_pct: '-1.15',
        close_yesterday: '1307.50',
        market_cap: '9181560374',
        volume: '658915',
        volume_avg: '1424357',
        shares: '710372176',
        stock_exchange_long: 'London Stock Exchange',
        stock_exchange_short: 'LSE',
        timezone: 'GMT',
        timezone_name: 'Europe/London',
        gmt_offset: '0',
        last_trade_time: '2020-01-29 16:35:26',
        pe: 'N/A',
        eps: '-0.24'
    },
    {
        symbol: 'TWTR',
        name: 'Twitter, Inc.',
        currency: 'USD',
        price: '33.63',
        price_open: '33.59',
        day_high: '33.88',
        day_low: '33.29',
        '52_week_high': '45.86',
        '52_week_low': '28.63',
        day_change: '0.21',
        change_pct: '0.63',
        close_yesterday: '33.42',
        market_cap: '26108887040',
        volume: '7116899',
        volume_avg: '13111050',
        shares: '776356992',
        stock_exchange_long: 'New York Stock Exchange',
        stock_exchange_short: 'NYSE',
        timezone: 'EST',
        timezone_name: 'America/New_York',
        gmt_offset: '-18000',
        last_trade_time: '2020-01-29 16:04:32',
        pe: '16.39',
        eps: '2.05'
    },
    {
        symbol: 'VUSA.L',
        name: 'VANGUARD/SHS USD',
        currency: 'GBP',
        price: '48.02',
        price_open: '47.96',
        day_high: '48.11',
        day_low: '47.77',
        '52_week_high': '48.65',
        '52_week_low': '37.99',
        day_change: '0.09',
        change_pct: '0.19',
        close_yesterday: '47.93',
        market_cap: 'N/A',
        volume: '84261',
        volume_avg: '151846',
        shares: 'N/A',
        stock_exchange_long: 'London Stock Exchange',
        stock_exchange_short: 'LSE',
        timezone: 'GMT',
        timezone_name: 'Europe/London',
        gmt_offset: '0',
        last_trade_time: '2020-01-29 16:30:00',
        pe: 'N/A',
        eps: 'N/A'
    }
]

a.forEach((stock) => {
    console.log(stock.symbol, stock.price, stock.currency, stock.name)
})