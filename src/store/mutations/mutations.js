// 
import currenciesAndPrices from "./currencies-and-prices";
import chartCandles from "./chart-candles"
// 
export default {
	...currenciesAndPrices,
	...chartCandles,

	IS_LOADED_PAGE(state, newValue) {
		return state.loadedPage = newValue
	},
	CHANGE_SELECTED_CURRENCY(state, newValue) {
		return state.selectedCurrency = newValue
	},
	SET_NEW_FILTER(state, newValue) {
		return state.filter = newValue
	}
}