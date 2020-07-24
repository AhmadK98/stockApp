import thunk from 'redux-thunk'

const currencyOptionReducer = (state = {currentCurrency: localStorage.currencyOption}, action) => {
	switch (action.type) {
		case "CHANGE_CURRENCY":
            state.prevCurrency = state.currentCurrency
			return state = {...state, currentCurrency: action.payload};
		

		default:
			return state;
	}
};

export default currencyOptionReducer;
