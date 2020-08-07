export class RedshiftMetricsTablesColumnsIgnoreStateQueriesDto {
	state: boolean;

	constructor(data?: RedshiftMetricsTablesColumnsIgnoreStateQueriesDto) {
		if(!data) {
			return;
		}

		this.state = typeof data.state === 'string' ? data.state === 'true' : data.state; // @TODO: temporary solution for route.queries
	}
}
