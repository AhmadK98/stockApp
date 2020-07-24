import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";

import "../dashboard.scss";
import { CurrencyContext } from "../CurrencyContext";

import { increment, fetchCurrency, changeCurrency} from "../../../actions";

const flagClasses = { GBP: "flag-icon-gb", USD: "flag-icon-us", PKR: "flag-icon-pk", EUR: "flag-icon-nl" };

function useLocalStorageCurrency(currencyOption, defaultValue) {
	const [currency, setCurrency] = useContext(CurrencyContext);
	const [flag, setFlag] = useState(flagClasses[currencyOption]);
	const [clone, setClone] = useState(flagClasses);
	

	useEffect(() => {
		window.localStorage.setItem("currencyOption", currency);

		setFlag(flagClasses[currency]);
		let cloneObject = Object.assign({}, flagClasses);
		delete cloneObject[currency];
		setClone(cloneObject);
	}, [currency, flag]);

	return [currency, setCurrency, flag, clone];
}

function CurrencyDropdown() {
	const [currency, setCurrency, flag, clone] = useLocalStorageCurrency(window.localStorage.getItem("currencyOption"), "AUD");
	// console.log(clone)
	const dispatch = useDispatch()
	const data = useSelector(state => state.currencyData)
	const currencyOptionRedux = useSelector(state => state.currencyOptionReducer)

	// console.log(currencyOptionRedux)
	return (
		<div className="dropdown" style={{ witdh: "5px" }}>
			<button
				className="btn btn-sm btn-secondary dropdown-toggle"
				type="button"
				id="dropdownMenuButton"
				data-toggle="dropdown"
				aria-haspopup="true"
				aria-expanded="false"
				onClick={()=>dispatch(async ()=>{
					
					let resCurrency = await fetch("/dashboard/currency");
					let currencyData = await resCurrency;
					let data = await currencyData.json()
					dispatch(fetchCurrency(data))
					
				}
					)}
			>
				<div className={flag + " flag-icon h col-md"}></div>
				{currency}
			</button>

			<div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ witdh: "5px" }}>
				{Object.keys(clone).map((flag) => {
					return (
						<a
							// href={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.0.0/flags/4x3/${flagClasses[flag].slice(
							// 	flagClasses[flag].length - 2,
							// 	flagClasses[flag].length
							// )}.svg`}
							className={`dropdown-item`}
							key={`${flag}-object`}
							onClick={() => {
								setCurrency(flag);
								dispatch(changeCurrency(flag))
							}}
						>
							<div className={flagClasses[flag] + " flag-icon col-md"}></div>
							<span className={`currencyText col-md`} key={`${flag}-flag`}>
								{flag}
							</span>
							<div className="dropdown-divider"></div>
							<div></div>
						</a>
					);
				})}
				<div>{data['USD']? `Updated: ${data['USD']['date'].slice((data['USD']['date']).length-10,(data['USD']['date']).length)}`:'a'}</div>
			</div>
		</div>
	);
}

export default CurrencyDropdown;
