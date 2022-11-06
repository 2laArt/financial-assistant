export default
	async function candlesData(pair, granules, dateStart, dateEnd) {
	try {
		const request = await fetch(
			`https://api.exchange.coinbase.com/products/${pair}/candles?granularity=${granules}&start=${dateStart}&end=${dateEnd}`
		);
		const data = await request.json()
		// console.log(dataCandles)
		return data;
	}
	catch (e) {
		console.error(e)
		return e
	}
}
