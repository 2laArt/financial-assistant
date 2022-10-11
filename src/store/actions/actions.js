import apiCriptocoin from "./addActions/api-criptocoin";
import apiCandles from "./addActions/api-candles";

export default {
	...apiCriptocoin,
	...apiCandles,
}