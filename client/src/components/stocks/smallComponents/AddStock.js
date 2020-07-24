import React, { useState, useEffect } from "react";

import "./addStock.scss";
// import { isCompositeType } from "graphql";
// import StockCard from "./StockCard";

function AddStock() {
	const [stocks, setStocks] = useState([]);

	// useEffect(() => {
	//     if (stocks.length == 0) {

	//     }
	// }, stocks)

	// let stockBox = document.getElementById("stockBox");

	async function searchStock(e) {
		// setStocks([]);
		// stockBox.classList.remove('hidden')
		if(e.length >0){
			let res = await fetch(`/stocks/search/${e}`);
			let data = await res.json();
			setStocks(await data.symbols);
		}else{
			setStocks([])
		}
		

		
		// console.log(data)
		// console.log(await stocks)
	}

	// console.log(stockBox)
	// if (stockBox) {

	//     document.addEventListener('click', function (event) {
	//         if (event.target.closest('st ckBox')) {
	//             stockBox.classList.remove('hidden')
	//         }
	//         console.log(event.target.closest)
	//         stockBox.classList.add('hidden')
	//     })
	// }
	// let companies = [];
	let searchStyle = {}
	useEffect(()=>{
		console.log(stocks)
		stocks.length === 0 ? searchStyle={ border: "none", display:'none'  } : searchStyle ={ border: "#ced4da 1px solid"}
		// console.log(searchStyle)
	},[stocks])


	return (
		<div>
			<input
				className="form-control searchBarPortfolio"
				type="text"
				placeholder="Search for a stock"
				onChange={(e) => searchStock(e.target.value)}
				onKeyUp={(e)=>{if ( e.keyCode === 27 ) {
					e.target.value=''
					setStocks([])}}}
				style={searchStyle}
			></input>
			<div className="searchStockBox">
				<ul
					id="stockBox"
					style={stocks.length === 0 ? { border: "none", display:'none'  } : { border: "#ced4da 1px solid"}}
				>
					{stocks.map((stock) => {
						return (
							<ul
								className="stockListObject"
								key={`${stock.company}${Math.random()*100}`}
							>{`${stock.company} ${stock.ticker}`}</ul>
						);
					})}
				</ul>
			</div>
		</div>
	);
}

export default AddStock;
