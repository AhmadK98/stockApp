tickerQuantity = { 'TSLA': 9, 'GOOGL': 1, 'AAPL': 2, 'MSFT': 3, 'PYPL': 3, 'AMD': 6, 'DIS': 2, 'JD.L': 11, 'SNAP': 5, 'SXX.L': 100 }

Object.keys(tickerQuantity).map(key => {
    console.log(`You have ${tickerQuantity[key]} ${key} shares`)
})