import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
// import "../../dashboard.scss";
import { CurrencyContext } from "../../CurrencyContext";

import { setSelectedTicker } from "../../../../actions";

function StockCard(props) {
	const [conversionValue, setConversionValue] = useState(1);
	const [selectedTickerStyle, setSelectedTickerStyle] = useState({ backgroundColor: "none" });
	const [currency] = useContext(CurrencyContext);
	const [logo, setLogo] = useState("https://i.redd.it/3k7uvh8rz5k41.jpg");
	const counter = useSelector((state) => state.counter);
	const currencyData = useSelector((state) => state.currencyData);
	const selectedTicker = useSelector((state) => state.selectedTicker);
	const dispatch = useDispatch();

	const currencyConverter = async (value, originalCurrency, convertedCurrency) => {
		let originalConvData = currencyData[originalCurrency]["currency"];
		let convertedConvData = currencyData[convertedCurrency]["currency"];
		// console.log(props.currencyConv[originalCurrency]['currency']);
		let convertedValue = value * (convertedConvData / originalConvData);
		// console.log(props.price);
		setConversionValue(convertedValue.toFixed(3));
		return convertedValue.toFixed(6);
	};
	// console.log(props.currencyConv);

	const stockPrice = (props) => {
		let stockPrice;

		if (currency != props.originalCurrency) {
			stockPrice = (
				<div>
					<span className="stockPrice" style={{ marginRight: "3px", fontSize: "15px" }}>{`${currencySymbol[props.originalCurrency]}${
						props.originalPrice
					}`}</span>
					<span className="stockPrice">{`${currencySymbol[currency]}${conversionValue}`}</span>
				</div>
			);
		} else {
			stockPrice = (
				<span className="stockPrice" style={{ marginRight: "3px", fontSize: "15px" }}>{`${currencySymbol[props.originalCurrency]}${
					props.originalPrice
				}`}</span>
			);
		}

		return stockPrice;
	};
	//
	// console.log(props)
	useEffect(() => {
		// console.log(props.prevClose);

		if (currencyData != 1) {
			currencyConverter(price, props.currency, currency);
		} else {
			setConversionValue(props.price);
		}
	}, [currency, currencyData]);

	let currencySymbol = { USD: "$", GBP: "£", EUR: "€", PKR: "₨" };
	let price = props.price;
	let currencyStyle = { left: "-15px" };

	let percentColor;
	let prevClose;
	let currentTime = new Date();

	/* Statements to for different currencies, ....
	

	*/
	let marketTime = {
		US: {
			open: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 14, 30, 0, 0),
			close: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 21, 0, 0, 0),
		},
		UK: {
			open: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 8, 0, 0, 0),
			close: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 16, 0, 0, 0),
		},
	};

	useEffect(() => {
		if (props.originalCurrency == "GBP") {
			let logoTicker = props.stock;
			setLogo(`https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${logoTicker.slice(0, logoTicker.length - 2) + "-LN"}.png`);
			// console.log(logo);
		} else {
			setLogo(`https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${props.stock}.png`);
		}
	}, []);

	if (props.originalCurrency == "USD") {
		if (currentTime < marketTime.US.close && currentTime > marketTime.US.open) {
			prevClose = Object.values(props.prevClose[0])[0];
		} else {
			prevClose = Object.values(props.prevClose[1])[0];
		}
	} else if (props.originalCurrency == "GBP") {
		if (currentTime < marketTime.UK.close && currentTime > marketTime.UK.open) {
			prevClose = Object.values(props.prevClose[0])[0];
		} else {
			prevClose = Object.values(props.prevClose[1])[0];
			// console.log(prevClose)
		}
	}

	if (props.originalPrice >= prevClose) {
		percentColor = { color: "#3E9E3E" };
	} else {
		percentColor = { color: "#BB2C3A" };
	}

	useEffect(() => {
		if (selectedTicker == props.stock) {
			// console.log(selectedTicker)
			setSelectedTickerStyle({ backgroundColor: "#d5d4cf" });
		} else {
			// console.log(props.stock)
			setSelectedTickerStyle({});
		}
	}, [selectedTicker]);

	let difference = props.originalPrice - prevClose;

	return (
		<div className={`stockObject ${props.stock} container card`} onClick={() => dispatch(setSelectedTicker(props.stock))} style={selectedTickerStyle}>
			<div className="row">
				<img
					className={`img ${props.stock}-logo col-1`}
					src={logo}
					onError={() => {
						setLogo("https://i.redd.it/3k7uvh8rz5k41.jpg");
					}}
				></img>
				<div className="col-8 stockContent">
					<div className="row">
						<div className="col- stockName">{props.name}</div>
					</div>

					<div className="row topRow col-">
						<div style={{ position: "relative", marginBottom: "5px", left: "6px" }}>
							<span className="currencySymbol" style={currency == "PKR" ? currencyStyle : {}}>
								{currencySymbol[currency]}
							</span>
							<div className="col- stockValue">
								{parseFloat(conversionValue) < 10 ? parseFloat(conversionValue).toFixed(4) : parseFloat(conversionValue).toFixed(3)}
							</div>

							<span
								behavior="scroll"
								direction="left"
								className={difference > 0 ? "stockPercent positive" : "stockPercent negative"}
								scrollamount="2"
							>
								{difference.toFixed(2)} &nbsp;&nbsp;&nbsp; {`${Math.abs(((difference / prevClose) * 100).toFixed(2))}%`} &nbsp;&nbsp;
								<div className="col- stockValueConvert" style={{ display: `${currency == props.originalCurrency ? "none" : "inline"}` }}>
									{currencySymbol[props.originalCurrency]}
									{Number(props.originalPrice).toFixed(2)}
								</div>
							</span>
						</div>
					</div>
					<div className="row bottomRow">
						<div className="col-">{`${props.amountHeld}: `}</div>
						<div className="col- ">
							{currencySymbol[currency]}
							{(conversionValue * props.amountHeld).toFixed(2)}
							<span className={difference > 0 ? "valueDifference positive" : "valueDifference negative"} style={percentColor}>
								{(difference * props.amountHeld).toFixed(2)}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default StockCard;
