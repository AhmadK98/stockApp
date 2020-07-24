import thunk from 'redux-thunk'

const selectedTicker = (state = 'TSLA', action) => {
	switch (action.type) {
		case "CHANGE_TICKER":
            
			return state = action.payload;
		

		default:
			return state;
	}
};

export default selectedTicker;
