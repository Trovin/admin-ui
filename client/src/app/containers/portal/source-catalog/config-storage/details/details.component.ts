import { Input, Component, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import { TabsetComponent } from 'ngx-bootstrap/tabs';

import { Config } from '@rest/config-storage/index';
import { DetailConfigModel, ConfigParams } from './details-config.model';

@Component({
	selector: 'config-details',
	templateUrl: './details.html',
	styleUrls: ['./details.scss']
})

export class DetailsComponent implements OnChanges {
	@ViewChild('detailsTabs', {static: true}) detailsTabs: TabsetComponent;

	@Input() item: Config;

	config: DetailConfigModel = new DetailConfigModel();

	ngOnChanges(change: SimpleChanges) {
		const item = change['item'];

		if(item && item.currentValue) {
			const selectedItem = item.currentValue as Config;

			this.config = new DetailConfigModel({
				schemaName: selectedItem.schemaName,
				tableName: selectedItem.tgTableName,

				columns: selectedItem.metaColumns,
				primaryKeys: selectedItem.pkColumns,
				orderColumns: selectedItem.orderColumns
			});

			this.config.columns = this.setFlagsOnColumns(this.config.columns);
		}
	}

	selectTab(tabId: number) {
		this.detailsTabs.tabs[tabId].active = true;
	}

	private setFlagsOnColumns(list: ConfigParams[]): ConfigParams[] {
		return list.map(config => {
			config.isPrimaryKey = this.config.primaryKeys.some(item => item.tableColumn === config.tableColumn);
			config.isModifiedDate = this.config.orderColumns.some(item => item.tableColumn === config.tableColumn);

			return config;
		});
	}
}
