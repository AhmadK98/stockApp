import thunk from "redux-thunk";

const currencyReducer = (state = 1, action) => {
	switch (action.type) {
		case "FETCH_CURRENCY":
			
			return state = action.payload;
		case "FETCH_ERROR":
			return state - action.payload;

		default:
			return state;
	}
};

export default currencyReducer;
