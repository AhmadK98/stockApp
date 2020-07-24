import React, { useState, createContext, useEffect } from "react";

export const CurrencyContext = createContext();

export const CurrencyProvider = (props) => {

	const [currency, setCurrency] = useState(localStorage.currencyOption || 'GBP')

	
	
	const [currencyData, setCurrencyData] = useState({ EUR: 2 });


	// useEffect(() => {
	// 	if ('currencyOption' in localStorage){
	// 		setCurrency(localStorage.currencyOption)
	// 	}
		
	// }, []);

	

	return (
		<CurrencyContext.Provider value={[currency, setCurrency]}>
			{props.children}
		</CurrencyContext.Provider>
	);
};
