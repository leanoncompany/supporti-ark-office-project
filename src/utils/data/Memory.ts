class Memory {
	private data: { [key: string]: any } = {};

	public setData(key: string, value: any) {
		this.data[key] = value;
	}

	public getData(key: string, defaultValue?: any) {
		const targetData = this.data[key];

		if (targetData === undefined) {
			return defaultValue;
		} else {
			return targetData;
		}
	}
}

export default Memory;
