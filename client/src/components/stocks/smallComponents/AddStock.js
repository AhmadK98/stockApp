import React, { useEffect, useState } from 'react';

import './addStock.scss';
import { isCompositeType } from 'graphql';
import StockCard from './StockCard';


function AddStock() {

    const [stocks, setStocks] = useState([])

    useEffect(() => {
        if (stocks.length == 0) {

        }
    }, stocks)

    let stockBox = document.getElementById('stockBox')

    async function searchStock(e) {
        setStocks([])
        stockBox.classList.remove('hidden')
        let res = await fetch(`/stocks/search/${e}`)
        let data = await res.json()

        setStocks(await data.symbols)
        console.log(data)
        console.log(await stocks)

    }

    console.log(stockBox)
    if (stockBox) {
        console.log('g')
        document.addEventListener('click', function (event) {
            if (event.target.closest('stockBox')) {
                stockBox.classList.remove('hidden')
            }
            stockBox.classList.add('hidden')
        })
    }

    return (
        <div>
            <input className="form-control searchBarPortfolio" type="text" placeholder="Search for a stock" onChange={(e) => searchStock(e.target.value)} onkeyup="if ( event.keyCode == 27 ) this.value=''" ></input>
            <div className='searchStockBox'>
                <ul id="stockBox" style={stocks.length == 0 ? { border: 'none' } : { border: '#ced4da 1px solid' }}>
                    {stocks.map((stock) => {

                        return <ul className='stockListObject' key={stock.company}>{`${stock.company} ${stock.ticker}`}</ul>
                    })}
                </ul>
            </div>
        </div>

    )
}

export default AddStock;