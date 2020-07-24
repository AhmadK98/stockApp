import counterReducer from './counter'
import currencyReducer from './currencyTest'
import currencyOptionReducer from './currencyOptionReducer'
import stockChart from './stockChart'
import selectedTicker from './selectedTicker'
import sortBy from './sortBy'

import {combineReducers} from 'redux'

const allReducers = combineReducers({
    'counter' : counterReducer,
    'currencyData' : currencyReducer,
    'currencyOptionReducer' : currencyOptionReducer,
    'stockData' : stockChart,
    'selectedTicker':selectedTicker,
    'sortBy': sortBy
})

export default allReducers