const filteredByKeys = (data = [], keys) => {
	return data
		.map((item, i) => {
			const obj = {};
			keys.forEach(key => {
				item[key] !== undefined ?
					obj[key] = item[key] :
					obj[key] = Math.floor((i * (Math.random() * 10)) % 360)
			})
			return obj
		})
}
export default filteredByKeys