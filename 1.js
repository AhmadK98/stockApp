

const testFunction = async () => {
    
    let stocks = ['1','2','3']
    let links = [stocks]
    let test = {}

    links.forEach(link => {
        link.forEach(stock =>{
            test[stock]= '120'
        })
    })
        
    
    return test
}

testFunction().then(data => console.log(data))