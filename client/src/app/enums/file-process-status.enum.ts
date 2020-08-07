export enum FileProcessStatus {
	REPLAY = 'REPLAY',
	PROCESSED_WITH_ERRORS = 'PROCESSED_WITH_ERRORS',
	IN_BATCH = 'IN_BATCH',
	PROCESSING = 'PROCESSING',
	IN_FLATTEN = 'IN_FLATTEN',
	IN_DATAMART = 'IN_DATAMART'
}

export namespace FileProcessStatus {
	export const aliasProperties = {
		'replay': FileProcessStatus.REPLAY,
		'processed-with-errors': FileProcessStatus.PROCESSED_WITH_ERRORS,
		'in-batch': FileProcessStatus.IN_BATCH,
		'processing': FileProcessStatus.PROCESSING,
		'in-flatten': FileProcessStatus.IN_FLATTEN,
		'in-datamart': FileProcessStatus.IN_DATAMART
	};

	export const aliasPropertiesUI = {
		'replay': 'Replay',
		'processed-with-errors': 'Processed With Errors',
		'in-batch': 'In Batch',
		'processing': 'Processing',
		'in-flatten': 'In Flatten',
		'in-datamart': 'In Datamart'
	};

	export function getAliasUI(processAlias: FileProcessStatus): string {
		const alias = FileProcessStatus.getAlias(processAlias);
		return aliasPropertiesUI[alias];
	}

	export function getByAlias(processAlias: string): FileProcessStatus {
		return aliasProperties[processAlias];
	}

	export function getAlias(process: FileProcessStatus): string {
		return Object.keys(aliasProperties).find(k => aliasProperties[k] === process);
	}
}
