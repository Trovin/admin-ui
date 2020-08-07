import { Injectable } from '@angular/core';

import { ConfigStorageItemDto } from '@rest/config-storage';
import { ConfigParams } from './config.interface';

@Injectable()
export class CSVGenerateService {
	private csvHeadersMap = [
		{
			headerCSV: 'SourceApplication',
			headerAPI: 'sourceApplication'
		},
		{
			headerCSV: 'Entity',
			headerAPI: 'eventId'
		},
		{
			headerCSV: 'JSONPath',
			headerAPI: 'jsonPath'
		},
		{
			headerCSV: 'ExplodeAlias',
			headerAPI: 'explodeAlias'
		},
		{
			headerCSV: 'SchemaName',
			headerAPI: 'schemaName'
		},
		{
			headerCSV: 'TableName',
			headerAPI: 'tableName'
		},
		{
			headerCSV: 'ColumnName',
			headerAPI: 'tableColumn'
		},
		{
			headerCSV: 'Type',
			headerAPI: 'type'
		},
		{
			headerCSV: 'Default',
			headerAPI: 'defaultValue'
		},
		{
			headerCSV: 'Criteria',
			headerAPI: 'criteria'
		},
		{
			headerCSV: 'Pattern',
			headerAPI: 'pattern'
		}
	];

	convertConfigToCSV(config: ConfigStorageItemDto): string {
		const headersCSV =  this.createHeadersCSV();
		const sourceApplication = config.sourceApplication;

		let eventId = config.eventId;
		let contentCSV = '';

		config.metadataList.forEach((list, index) => {
			if(index) {
				eventId = `${config.eventId}_${index}`;
			}

			contentCSV += list.metaColumns.reduce((accumulator, config) => accumulator += this.createRowCSV(config, sourceApplication, eventId), '');
		});

		return headersCSV + contentCSV;
	}

	private createHeadersCSV(): string {
		return `${this.csvHeadersMap.map(item => `${item.headerCSV}`).join(',')}` + '\r\n';
	}

	private createRowCSV(config: ConfigParams, source: string, event: string): string {
		const row = this.csvHeadersMap.map(item => {
			const param = config[item.headerAPI];

			switch(true) {
				case !!param:
					return param.includes(',') ? '"' + param + '"' : param;
				case item.headerAPI === 'sourceApplication':
					return source;
				case item.headerAPI === 'eventId':
					return event;
				default:
					return '';
			}
		});

		return row.join(',') + '\r\n';
	}
}
