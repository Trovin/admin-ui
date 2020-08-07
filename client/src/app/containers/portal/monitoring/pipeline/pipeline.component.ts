import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { ParamsService } from '@containers/shared/params.service';

import { DateRangeType } from '@enums/date-range-type.enum';
import { PipelineProcessType } from '@enums/pipeline-process-type.enum';
import { PipelineType } from '@enums/pipeline-type.enum';

@Component({
	selector: 'monitoring-pipeline',
	templateUrl: './pipeline.html',
	styleUrls: ['./pipeline.scss']
})

export class MonitoringPipelineComponent implements OnDestroy {
	private monitoringDataSub: Subscription;

	params: {[key:string]: string} = {};

	dataRangeType = DateRangeType;
	processTypeName = '';
	pipeline = '';

	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	constructor(private paramsService: ParamsService) {
		this.monitoringDataSub = this.paramsService
			.getDataSubj()
			.subscribe(data => {
				this.params.sourceApplication = data.sourceApplication;
				this.params.pipeline = data.pipelineAlias;
				this.params.process = data.process;

				const dates = DateRangeType.getDateRangeData(data.dateRange);
				this.params.dateRange = dates.dateRange || data.dateRange;
				this.params.dateFrom = dates.dateFrom || data.dateFrom;
				this.params.dateTo = dates.dateTo || data.dateTo;
				this.params.dateRangeColumnType = data.dateRangeColumnType;

				if(data.pipelineAlias) {
					const pipeline = PipelineType.getByAlias(data.pipelineAlias);
					const pipelineValues = PipelineType.getValues(pipeline);
					const processTypeName = PipelineProcessType.getByAlias(this.params.process);
					this.pipeline = PipelineType.getAliasUI(pipeline);
					this.processTypeName = PipelineProcessType.getAliasUI(processTypeName);
				}
			});
	}

	ngOnDestroy() {
		this.monitoringDataSub.unsubscribe();
	}
}
