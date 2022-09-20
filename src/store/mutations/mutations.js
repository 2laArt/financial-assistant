
export default {
	SET_ALL_PRICES_TO_STATE(state, prices) {
		return state.priceAllItems = prices
	},
	SET_CURRENCIES_TO_STATE(state, currenciesInfo) {
		const keys = ['id', 'name', 'color']
		const currenciesData = currenciesInfo
			.map((item, i) => {
				const obj = {};
				keys.forEach(key => {
					item[key] !== undefined ?
						obj[key] = item[key] :
						obj[key] = Math.floor((i * (Math.random() * 10)) % 360)
				})
				return obj
			})
		return state.currencies = currenciesData
	},
	ADD_PRICES_TO_CURRENCIES(state) {
		return state.currencies.map(item =>
			item.price = state.priceAllItems[item.id]
		)
	}
}