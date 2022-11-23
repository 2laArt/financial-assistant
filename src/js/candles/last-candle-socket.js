// 

const ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');
const lastCandle =
	[Date.now(),
		undefined,
		undefined,
		undefined,
		undefined,
		5.322,
	];
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
	const answer = JSON.parse(e.data)
	candlePrices(answer.price)
	// lastCandle = console.log(answer);
})
function candlePrices(price) {
	if (!lastCandle[3]) lastCandle[3] = price;
	if (lastCandle[1] > price || !lastCandle[1]) lastCandle[1] = price;
	if (lastCandle[2] < price || !lastCandle[2]) lastCandle[2] = price;
	lastCandle[4] = price;
}


window.testcandles = lastCandle;
export default lastCandle;