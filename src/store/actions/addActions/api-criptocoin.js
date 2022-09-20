


export default {
	async GET_LIST_ALL_CURRENCIES_FROM_API({ commit }) {
		try {
			const response = await fetch(`https://api.coinbase.com/v2/currencies`)
			const currenciesInfo = await response.json()
			return commit('SET_CURRENCIES_TO_STATE', currenciesInfo.data)
		}
		catch (e) {
			console.error(e)
			return e
		}
	},
	async GET_PRICES_FOR_CURRENCY_FROM_API({ commit }, token) {
		try {
			const response = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${token}`)
			const data = await response.json()
			return commit('SET_ALL_PRICES_TO_STATE', data.data.rates)
		} catch (e) {
			console.error(e)
			return e
		}
	},
}