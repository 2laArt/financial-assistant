// 
import candlesData from "../../addModules/candles-api";
// 
export default {
	async GET_CHART_TO_CURRENCY_PAIR_FROM_API({ commit },
		{ pair, granules, dateStart, dateEnd }
	) {
		const data = await candlesData(pair, granules, dateStart, dateEnd)
		return commit("SET_CHART_TO_STATE", data)
	},
	async GET_CANDLES_FROM_API({ commit },
		{ pair, granules, dateStart, dateEnd }
	) {
		const data = await candlesData(pair, granules, dateStart, dateEnd)
		return commit("SET_CANDLES_TO_STATE", data)
	}
}