import thunk from 'redux-thunk'

const stockChart = (state = 1, action) => {
	switch (action.type) {
		case "SET_STOCK_DATA":
            
			return state = action.payload ;
		

		default:
			return state;
	}
};

export default stockChart;
