import filteredByKeys from "../addModules/filteredByKeys"

export default {
	SET_ALL_PRICES_TO_STATE(state, prices) {
		return state.priceAllItems = prices
	},
	SET_CURRENCIES_TO_STATE(state, currenciesInfo) {
		const keys = ['id', 'name', 'color']
		return state.currencies = filteredByKeys(currenciesInfo, keys)
	},
	SET_CRYPTO_TO_STATE(state, currenciesInfo) {
		const keys = ['id', 'name', 'color']
		return state.crypto = filteredByKeys(currenciesInfo, keys)
	},
	ADD_PRICES_TO_CURRENCIES(state) {
		return state.currencies.map(item =>
			item.price = state.priceAllItems[item.id] / 1
		)
	},
	ADD_PRICES_TO_CRYPTO(state) {
		return state.crypto.map(item =>
			item.price = state.priceAllItems[item.id] / 1
		)
	},
	SET_CANDLES_TO_STATE(state, dataCandles) {
		return state.candles = dataCandles
	},
	IS_LOADED_PAGE(state, newValue) {
		return state.loadedPage = newValue
	},
	CHANGE_SELECTED_CURRENCY(state, newValue) {
		return state.selectedCurrency = newValue
	}
}