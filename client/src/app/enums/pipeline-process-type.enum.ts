export enum PipelineProcessType {
	BATCH = 'BATCH',
	DATA_TRANSFER = 'DATA_TRANSFER',
	REDSHIFT_DATA_COPY = 'REDSHIFT_DATA_COPY',
	REDSHIFT = 'REDSHIFT'
}

export namespace PipelineProcessType {
	export const aliasProperties = {
		'batch': PipelineProcessType.BATCH,
		'data-transfer': PipelineProcessType.DATA_TRANSFER,
		'redshift-data-copy': PipelineProcessType.REDSHIFT_DATA_COPY,
		'redshift': PipelineProcessType.REDSHIFT
	};

	export const aliasPropertiesUI = {
		'batch': 'Batch files app',
		'data-transfer': 'Data transfer',
		'redshift-data-copy': 'Redshift data copy',
		'redshift': 'Redshift'
	};

	export function getAliasUI(processAlias: PipelineProcessType): string {
		const processType = PipelineProcessType.getAlias(processAlias);
		return aliasPropertiesUI[processType];
	}

	export function getByAlias(processAlias: string): PipelineProcessType {
		return aliasProperties[processAlias];
	}

	export function getAlias(process: PipelineProcessType): string {
		return Object.keys(aliasProperties).find(k => aliasProperties[k] === process);
	}
}
