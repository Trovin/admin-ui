export enum PipelineType {
	REAL_TIME = 'REAL_TIME',
	BATCH = 'BATCH',
	HISTORICAL_REAL_TIME = 'HISTORICAL_REAL_TIME',
	HISTORICAL_BATCH = 'HISTORICAL_BATCH'
}

export type PipelineValuesModel = {
	pipeline: PipelineType;
	alias: string;
	aliasUi: string;
	isBatch: boolean;
	isHistorical: boolean;
};

export namespace PipelineType {
	export const properties = {
		'real-time': PipelineType.REAL_TIME,
		'batch': PipelineType.BATCH,
		'historical-real-time': PipelineType.HISTORICAL_REAL_TIME,
		'historical-batch': PipelineType.HISTORICAL_BATCH
	};

	export const aliasPropertiesUI = {
		'real-time': 'Real-time',
		'batch': 'Batch',
		'historical-real-time': 'Historical Real-time',
		'historical-batch': 'Historical Batch'
	};

	export const VALUES: PipelineValuesModel[] = [
		{pipeline: PipelineType.REAL_TIME, alias: 'real-time', isBatch: false, isHistorical: false, aliasUi: aliasPropertiesUI['real-time']},
		{pipeline: PipelineType.BATCH, alias: 'batch', isBatch: true, isHistorical: false, aliasUi: aliasPropertiesUI['batch']},
		{pipeline: PipelineType.HISTORICAL_REAL_TIME, alias: 'historical-real-time', isBatch: false, isHistorical: true, aliasUi: aliasPropertiesUI['historical-real-time']},
		{pipeline: PipelineType.HISTORICAL_BATCH, alias: 'historical-batch', isBatch: true, isHistorical: true, aliasUi: aliasPropertiesUI['historical-batch']}
	];

	export function getAliasUI(processAlias: PipelineType): string {
		const pipelineType = PipelineType.getAlias(processAlias);
		return aliasPropertiesUI[pipelineType];
	}

	export function getByAlias(pipelineAlias: string): PipelineType {
		return properties[pipelineAlias];
	}

	export function getAlias(pipeline: PipelineType): string {
		return Object.keys(properties).find(k => properties[k] === pipeline);
	}

	export function getValues(pipeline: PipelineType): PipelineValuesModel {
		return VALUES.find(i => i.pipeline === pipeline);
	}
}
