
export default {
	CRYPTO(state) {
		return state.crypto
	},
	CURRENCIES(state) {
		return state.currencies
	},
	PRICE_ALL_ITEM(state) {
		return state.priceAllItems
	},
	CHART(state) {
		return state.chart
	},
	CANDLES(state) {
		return state.candles
	},
	LOADED_PAGE(state) {
		return state.loadedPage
	},
	SELECTED_CURRENCY(state) {
		return state.selectedCurrency;
	},
	FILTER(state) {
		return state.filter;
	},
}