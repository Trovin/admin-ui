export class NGXLineChartModel {
	view?: any[];
	showXAxis?: boolean;
	showYAxis?: boolean;
	gradient?: boolean;
	showLegend?: boolean;
	legendTitle?: string;
	showXAxisLabel?: boolean;
	xAxisLabel?: string;
	showYAxisLabel?: boolean;
	yAxisLabel?: string;
	yScaleMin?: number;
	xScaleMin?: number;
	colorScheme?: any;
	autoScale?: boolean;

	constructor(data?: NGXLineChartModel) {
		if(!data) {
			return;
		}
		Object.assign(this, data);
	}
}
