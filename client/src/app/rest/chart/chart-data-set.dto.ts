import { ChartDataDto } from './chart-data.dto';

export class ChartDataSetDto {
	data: ChartDataDto[];
	label: string;

	constructor(data?: ChartDataSetDto) {
		if(!data) {
			return;
		}
		this.data = data.data;
		this.label = data.label;
	}
}
