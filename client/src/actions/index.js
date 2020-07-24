//counter
export const increment = (nr) => {
	// nr = 'g'
	return {
		type: "INCREMENT",
		payload: nr,
	};
};
//currencyTest
export const fetchCurrency = (data) => {
    
	return {
		type: "FETCH_CURRENCY",
		payload: data,
	};
};
//currencyOptionReducer
export const changeCurrency = (data) => {
    
	return {
		type: "CHANGE_CURRENCY",
		payload: data,
	};
};

export const setStockData = (data) => {
    
	return {
		type: "SET_STOCK_DATA",
		payload: data,
	};
};

export const setSelectedTicker = (data) =>{
	return{
		type:"CHANGE_TICKER",
		payload: data,
	}
}


export const setSortBy = (data) =>{
	return{
		type:"CHANGE_SORT",
		payload: data,
	}
}