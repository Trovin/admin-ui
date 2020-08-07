export enum SortColumnType {
	NAME = 'NAME',
	DATE = 'DATE',
	KEY = 'key',
	LAST_MODIFIED = 'LAST_MODIFIED',
	APPLIED_DATE = 'APPLIED_DATE',
	SOURCE_APP = 'SOURCE_APP',
	EVENT_ID = 'EVENT_ID',
	OBJECT_KEY = 'OBJECT_KEY'
}

export namespace SortColumnType {
	export const properties = {
		'name': SortColumnType.NAME,
		'date': SortColumnType.DATE,
		'lastModified': SortColumnType.LAST_MODIFIED,
		'appliedDate': SortColumnType.APPLIED_DATE,
		'sourceApp': SortColumnType.SOURCE_APP,
		'eventId': SortColumnType.EVENT_ID,
		'objectKey': SortColumnType.OBJECT_KEY
	};

	export function getByAlias(pipelineAlias: string): SortColumnType {
		return properties[pipelineAlias];
	}

	export function getAlias(pipeline: SortColumnType): string {
		return Object.keys(properties).find(k => properties[k] === pipeline);
	}
}