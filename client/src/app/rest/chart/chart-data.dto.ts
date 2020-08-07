export class ChartDataDto {
	x: number;
	y: number;

	constructor(data?: ChartDataDto) {
		if(!data) {
			return;
		}
		Object.assign(this, data);
	}
}
