
export class MetricDataResult {
	Id: string;
	Label: string;
	Timestamps: Date[];
	Values: number[];

	constructor(data: MetricDataResult) {
		if(!data) {
			return;
		}

		this.Id = data.Id;
		this.Label = data.Label;
		this.Timestamps = data.Timestamps;
		this.Values = data.Values;
	}
}
