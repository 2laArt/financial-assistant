// 
// 
export default {
	async GET_CANDLES_TO_CURRENCY_PAIR_FROM_API({ commit }, { pair, dateStart, dateEnd }) {
		try {
			const request = await fetch(
				`https://api.exchange.coinbase.com/products/${pair}/candles?granularity=60&start=${dateStart}&end=${dateEnd}`
			);
			const dataCandles = await request.json()
			console.log(dataCandles)
			return commit("SET_CANDLES_TO_STATE", dataCandles)
		}
		catch (e) {
			console.error(e)
			return e
		}
	}
}