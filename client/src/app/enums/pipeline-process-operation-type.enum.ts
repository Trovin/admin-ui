export enum PipelineProcessOperationType {
	INPUT = 'INPUT',
	OUTPUT = 'OUTPUT'
}

export namespace PipelineProcessOperationType {
	export function values(): PipelineProcessOperationType[] {
		return [
			PipelineProcessOperationType.INPUT,
			PipelineProcessOperationType.OUTPUT
		];
	}
}
