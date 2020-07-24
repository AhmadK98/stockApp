import thunk from "redux-thunk";

const sortBy = (state = "", action) => {
	switch (action.type) {
		case "CHANGE_SORT":
			if (state == action.payload){
				action.payload = '-' + action.payload
			}
			return (state = action.payload);

		default:
			return state;
	}
};

export default sortBy;
