import React, { useEffect, useState } from "react";
import "./dashboard.scss";
import CurrencyDropdown from "./smallComponents/CurrencyDropdown";
import StockList from "./smallComponents/stockList/StockList";
import PortfolioGraph from "./smallComponents/PortfolioGraph";
import AddStock from "./smallComponents/AddStock";
import { useSelector } from "react-redux";

import { CurrencyProvider, CurrencyContext } from "./CurrencyContext";

function Dashboard(props) {
	const [portfolio, setPortfolio] = useState();
	const [currency, setCurrency] = useState(localStorage.currencyOption || "GBP");
	const currencySymbol = { USD: "$", GBP: "£", EUR: "€", PKR: "₨" };
	const currencyData = useSelector((state) => state.currencyData);
	const currencyOptionRedux = useSelector((state) => state.currencyOptionReducer);

	async function getData() {
		let res = await fetch(`/dashboard/portfolioValue/1?currency=${localStorage.currencyOption || "GBP"}`);

		let data = await res;

		let jsonData = await data.json();
		// console.log(jsonData);
		setPortfolio(jsonData);

		return await jsonData;
	}

	useEffect(() => {
		getData().then((data) => {
			// setPortfolio(data);
			// console.log(currencySymbol[currencyOptionRedux["currentCurrency"]]);
			// document.title = `${currencySymbol[currencyOptionRedux["currentCurrency"]]}${portfolio ? portfolio.value : data.value} - Stock Tracker`; //change

			// console.log(portfolio)
		});
	}, []);

	useEffect(() => {
		if (currencyData != 1) {
			setPortfolio({
				...portfolio,
				value: (
					(portfolio.value * currencyData[currencyOptionRedux.currentCurrency]["currency"]) /
					currencyData[currencyOptionRedux.prevCurrency]["currency"]
				).toFixed(2),
			});
			// console.log(currencySymbol[currencyOptionRedux["currentCurrency"]]);
			
		}
		
	}, [currencyOptionRedux]);

	useEffect(() => {
		if (portfolio) {
			document.title = `${currencySymbol[currencyOptionRedux["currentCurrency"]]}${portfolio.value} - Stock Tracker`;
		}
	}, [portfolio]);

	return (
		<div className="dashboard">
			<div className="row">
				<div className="col-md-1" style={{ color: "red", marginTop: "9px", marginLeft: "15 px" }}>
					<span>Portfolio</span>
				</div>

				<div className="test col-md-7" style={{ color: "red" }}>
					<span style={{ fontSize: "0.7em" }}>Your portfolio value: </span>
					<div className="test2">{currencySymbol[currencyOptionRedux["currentCurrency"]]}{portfolio ? portfolio.value : "---"}</div>
				</div>
				<CurrencyProvider>
					<div className="col-md-3" style={{ marginRight: "0px" }}>
						<CurrencyDropdown />
					</div>

					<div className="col-md-3" style={{ height: "99vh" }}>
						<StockList stockData={portfolio} />
					</div>
				</CurrencyProvider>

				<div className="container col-md-9 col-xs-5" style={{ background: "none" }}>
					<div className="col-md-12">
						<PortfolioGraph />
						<AddStock />
					</div>

					<div></div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
