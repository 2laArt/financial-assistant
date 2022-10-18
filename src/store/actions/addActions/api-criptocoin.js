


export default {
	async GET_PRICES_FOR_CURRENCY_FROM_API({ commit }, token) {
		try {
			const request = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${token}`)
			const data = await request.json()
			// console.log(data.data.rates)
			return commit('SET_ALL_PRICES_TO_STATE', data.data.rates)
		}
		catch (e) {
			console.error(e)
			return e
		}
	},
	async GET_LIST_ALL_CURRENCIES_FROM_API({ commit }) {
		try {
			const request = await fetch(`https://api.coinbase.com/v2/currencies`)
			const currenciesData = await request.json()
			return commit('SET_CURRENCIES_TO_STATE', currenciesData.data)
		}
		catch (e) {
			console.error(e)
			return e
		}
	},
	async GET_LIST_ALL_CRYPTO_FROM_API({ commit }) {
		try {
			const request = await fetch(`https://api.exchange.coinbase.com/currencies`);
			const data = await request.json();
			const crypto = data.filter(item => item.details.type === 'crypto');
			return commit('SET_CRYPTO_TO_STATE', crypto)
		}
		catch (e) {
			console.error(e)
			return e
		}
	}

}