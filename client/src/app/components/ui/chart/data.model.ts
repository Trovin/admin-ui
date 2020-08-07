import { DataSetModel } from './data-set.model';

export class DataModel {
	datasets: DataSetModel[] = [];
	xAxis?: string[] = [];

	constructor(data?: DataModel) {
		if(!data) {
			return;
		}
		this.datasets = data.datasets.map(i => new DataSetModel(i));
		this.xAxis = data.xAxis;
	}
}
