// 

const ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');

const priceHandlers = new Map();

ws.addEventListener('open', () => {
	let msg = {
		"type": "subscribe",
		"product_ids": [
			"BTC-USD"
		],
		"channels": [
			"ticker",
		]
	}
	ws.send(JSON.stringify(msg))
})
ws.addEventListener('message', (e) => {
	const response = JSON.parse(e.data);
	const id = response?.product_id;
	const price = response.price
	if (!id) return;
	// candlePrices(response.price)
	const handler = priceHandlers.get(id) ?? [];
	handler.forEach(fn => fn(price));
})

export function getUpdatePrice(pair, cb) {
	const cur = priceHandlers.get(pair) ?? []; //rename!!
	priceHandlers.set(pair, [...cur, cb])
}
