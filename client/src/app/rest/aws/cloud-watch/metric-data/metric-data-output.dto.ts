import { MetricDataResult } from './metric-data-result.dto';

export class GetMetricDataOutput {
	MetricDataResults: MetricDataResult[];

	constructor(data: GetMetricDataOutput) {
		if(!data) {
			return;
		}

		this.MetricDataResults = data.MetricDataResults.map(i => new MetricDataResult(i));
	}
}
