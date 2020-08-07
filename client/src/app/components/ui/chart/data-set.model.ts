import { ChartDataDto } from '@rest/chart/chart-data.dto';

export class DataSetModel {
	data: ChartDataDto[] | number[];
	backgroundColor?: string;
	borderColor?: string;
	borderWidth?: number;
	fill?: boolean|string;
	label?: string;
	lineTension?: number;
	hidden?: boolean;

	constructor(data?: DataSetModel) {
		this.data = data.data || [];
		this.backgroundColor = data.backgroundColor;
		this.borderColor = data. borderColor;
		this.borderWidth = data.borderWidth;
		this.fill = data.fill;
		this.label = data.label;
		this.lineTension = data.lineTension;
		this.hidden = data.hidden;
	}
}
