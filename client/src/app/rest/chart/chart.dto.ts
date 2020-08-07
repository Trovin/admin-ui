import { ChartDataSetDto } from './chart-data-set.dto';

export class ChartDto {
	datasets: ChartDataSetDto[];
	xAxis?: string[] = [];

	constructor(data?: ChartDto) {
		if(!data) {
			return;
		}
		this.datasets = data.datasets;
		this.xAxis = data.xAxis;
	}
}
