export enum DateRangeColumnType {
	RAW_FILE_CREATED_TIME = 'RAW_FILE_CREATED_TIME',
	START_TIME = 'START_TIME',
	END_TIME = 'END_TIME',
	TO_DATE = 'TO_DATE',
	FROM_DATE = 'FROM_DATE',
	OBJECT_KEY = 'OBJECT_KEY'
}

export type DateRangeColumnTypeValuesModel = {
	value: DateRangeColumnType;
	name: string;
};

export namespace DateRangeColumnType {
	export const VALUES: DateRangeColumnTypeValuesModel[] = [
		{value: DateRangeColumnType.RAW_FILE_CREATED_TIME, name: 'Raw File Created time'},
		{value: DateRangeColumnType.START_TIME, name: 'Start Time'},
		{value: DateRangeColumnType.END_TIME, name: 'End Time'}
	];

	export function getValues(value: DateRangeColumnType): DateRangeColumnTypeValuesModel {
		return VALUES.find(i => i.value === value);
	}

	export function getName(value: DateRangeColumnType): string {
		return VALUES.find(e => e.value === value).name;
	}
}
