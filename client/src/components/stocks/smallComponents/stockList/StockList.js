import React, { useEffect, useState } from "react";
import StockCard from "./StockCard";
import { useSelector, useDispatch } from "react-redux";
import { setSortBy } from "../../../../actions";

import "./stockListStyles.scss";
import AddStock from "../AddStock";

function StockList(props) {
	const [stockList, setStockList] = useState([]);
	const [currencyConvert, setCurrencyConvert] = useState({ EUR: 2 });
	const [searchTerm, setSearchTerm] = useState("");
	const dispatch = useDispatch();
	const [showSortArrow, setSortArrow] = useState({
		name: { display: "none" },
		price: { display: "none" },
		"no. shares": { display: "none" },
		"total value": { display: "none" },
	});

	const sortByOption = useSelector((state) => state.sortBy);
	let c;
	let localSortByOption;
	let filteredList;
	let pop;
	const switchArrow = (e) => {
		pop = e.target.innerHTML.split("<")[0].toLowerCase();
		let notSelectedKeys = [];
		Object.keys(showSortArrow).map((key) => {
			if (key != pop) {
				notSelectedKeys.push(key);
			}
		});

		if (showSortArrow[e.target.innerHTML.split("<")[0].toLowerCase()].display == "none") {
			setSortArrow({
				...showSortArrow,
				[pop]: { display: "" },
				[notSelectedKeys[0]]: { display: "none" },
				[notSelectedKeys[1]]: { display: "none" },
				[notSelectedKeys[2]]: { display: "none" },
			});
		}
		try {
			// console.log(e.target.querySelector('i'))
			if (e.target.querySelector("i").className == "arrow up") {
				return (e.target.querySelector("i").className = "arrow down");
			} else {
				return (e.target.querySelector("i").className = "arrow up");
			}
		} catch {
			if (e.target.className == "arrow up") {
				return (e.target.className = "arrow down");
			} else {
				return (e.target.className = "arrow up");
			}
		}
	};

	useEffect(() => {
		console.log(props.stockData)
		if (props.stockData != null) {
			filteredList = props.stockData["stocksOwned"].filter((ticker) => {
				return ticker.name.toLowerCase().includes(searchTerm.toLowerCase()) || ticker.ticker.toLowerCase().includes(searchTerm.toLowerCase());
			});

			if (filteredList.length == 0) {
				filteredList = [
					{
						name: "You don't have this :( \n Try to add it to your portfolio.",
						ticker: "NA",
						key: "NA",
						amount:'999',
						price: '999',
						currency: "GBP",
						original_currency: "GBP",
						original_price: '999',
						prev_close:[{'2020-07-24T19:59:56+00:00': "999"},{'2020-07-24T19:59:56+00:00': "999"}]
					},
				];
			} else {
				filteredList.sort((a, b) => {
					localSortByOption = sortByOption;
					if (sortByOption[0] == "-") {
						c = b;
						b = a;
						a = c;
						localSortByOption = sortByOption.slice(1, sortByOption.length);
					}

					if (localSortByOption == "name") {
						return a.name.localeCompare(b.name);
					} else if (localSortByOption == "total_value") {
						return b["price"] * b["amount"] - a["price"] * a["amount"];
					} else {
						return b[localSortByOption] - a[localSortByOption];
					}
				});
			}

			setStockList(
				filteredList.map((ticker) => {
					return (
						<StockCard
							name={ticker["name"]}
							stock={ticker["ticker"]}
							key={ticker["ticker"]}
							amountHeld={ticker["amount"]}
							price={ticker["price"]}
							currency={ticker["currency"]}
							originalCurrency={ticker["original_currency"]}
							originalPrice={ticker["original_price"]}
							prevClose={ticker["prev_close"]}
						/>
					);
				})
			);
		}
	}, [props.stockData, sortByOption, searchTerm]);

	return (
		<div className="stockList">
			{/* <AddStock /> */}
			<input
				onChange={(e) => setSearchTerm(e.target.value)}
				onKeyUp={(e) => {
					if (e.keyCode === 27) {
						e.target.value = "";
						setSearchTerm("");
					}
				}}
				className="filterStockSearch"
			></input>
			{/* <button onClick={() => dispatch(setSortBy("name"))}>Name</button>
			<button onClick={() => dispatch(setSortBy("price"))}>Price</button>
			<button onClick={() => dispatch(setSortBy("amount"))}>Amount</button> */}
			<span className="sort">Filter by:</span>
			<div className="sort">
				<span
					className="sortItem"
					onClick={(e) => {
						switchArrow(e);
						dispatch(setSortBy("name"));
					}}
				>
					Name<i className="arrow up" style={showSortArrow["name"]}></i>
				</span>
				<span
					className="sortItem"
					onClick={(e) => {
						switchArrow(e);
						dispatch(setSortBy("price"));
					}}
				>
					Price<i className="arrow up" style={showSortArrow["price"]}></i>
				</span>
				<span
					className="sortItem"
					onClick={(e) => {
						switchArrow(e);
						dispatch(setSortBy("amount"));
					}}
				>
					No. Shares<i className="arrow up" style={showSortArrow["no. shares"]}></i>
				</span>
				<span
					className="sortItem"
					onClick={(e) => {
						switchArrow(e);
						dispatch(setSortBy("total_value"));
					}}
				>
					Total Value<i id="arrow" className="arrow up" style={showSortArrow["total value"]}></i>
				</span>
			</div>

			{/* <button>{sortByOption}</button> */}
			<div className={`stockCard`} style={{ color: "black", paddingRight: "10px", height: "81vh", overflowY: "scroll" }}>
				{stockList}
			</div>
		</div>
	);
}

export default StockList;
