import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';

import { SortDirection } from '@enums/sort-direction.enum';

import { RedshiftViewerConfigDto, RedshiftViewerConfigService } from '@rest/redshift/viewer/config/index';
import { RedshiftDataTableDto, RedshiftDataTableService, RedshiftDataTableQueriesDto } from '@rest/redshift/viewer/data-table';

@Component({
	selector: 'redshift-viewer',
	templateUrl: './redshift-viewer.html',
	styleUrls: ['./redshift-viewer.scss']
})

export class RedshiftViewerComponent implements OnInit {
	@ViewChild('schemas', {static: true}) schemaList: DropdownItemPickerComponent;
	@ViewChild('tables', {static: true}) tableList: DropdownItemPickerComponent;
	@ViewChild('viewerTabs', {static: true}) viewerTabs: TabsetComponent;

	private defaultLimit = 100;
	private isDefaultOrderBy = true;
	private items: RedshiftViewerConfigDto[] = [];

	schemaListSubj = new Subject<DropdownItemPickerModel[]>();
	tableListSubj = new Subject<DropdownItemPickerModel[]>();

	params = new RedshiftDataTableQueriesDto();
	currentParams = new RedshiftDataTableQueriesDto();

	dataTable = new RedshiftDataTableDto({rows: []});
	tableTitlesList = null;

	dataErrorMsg = '';
	loading = false;

	isAutoSave = false;
	downloadsFileParams: RedshiftDataTableQueriesDto[];

	constructor(
		private redshiftViewerConfigService: RedshiftViewerConfigService,
		private redshiftDataTableService: RedshiftDataTableService
	) {}

	ngOnInit() {
		this.initConfig();
		this.downloadsFileParams = [];
		this.params.limit = this.defaultLimit;
	}

	private initConfig() {
		this.configAllStatuses(true);

		this.redshiftViewerConfigService
			.getList()
			.subscribe(
				resp => {
					this.items = resp;
					this.composeSchemaList();
					this.dataErrorMsg = '';
					this.configAllStatuses(false);
				},
				error => {
					this.items = [];
					this.dataErrorMsg = error.message;
					this.configAllStatuses(false);
				}
			);
	}

	private composeSchemaList() {
		const schemaList = this.items.map((item, index) => {
			const isFirstElement = index === 0;
			const schema = new DropdownItemPickerModel({
				name: `${item.schema}`,
				value: {name: item.schema},
				checked: isFirstElement
			});

			if(isFirstElement) {
				this.selectSchema(schema);
			}

			return schema;
		});

		this.schemaListSubj.next(schemaList);
		this.schemaListSubj.complete();
	}

	private composeTableList(schema: string) {
		const selectedSchema = this.items.filter(e => e.schema === schema)[0];
		const tableList = selectedSchema.tables.map((item, index) => {
			const isFirstElement = index === 0;
			const table = new DropdownItemPickerModel({
				name: `${item}`,
				value: {name: item},
				checked: isFirstElement
			});

			if(isFirstElement) {
				this.selectTable(table);
			}

			return table;
		});

		this.tableList.composeData(tableList);
	}

	private configAllStatuses(isDone: boolean) {
		this.loading = isDone;
		this.configSchemaStatuses(isDone, isDone);
		this.configTableStatuses(isDone, isDone);
	}

	private configSchemaStatuses(loading: boolean, disabled: boolean) {
		this.schemaList.loading = loading;
		this.schemaList.disabled = disabled;
	}

	private configTableStatuses(loading: boolean, disabled: boolean) {
		this.tableList.loading = loading;
		this.tableList.disabled = disabled;
	}

	private setOrderBy(name: string, direction: string) {
		this.params.orderBy = name;
		this.params.orderByType = direction;
		this.isDefaultOrderBy = false;
	}

	private resetOrderBy() {
		this.params.orderBy = '';
		this.params.orderByType = '';
		this.isDefaultOrderBy = true;
	}

	private switchOrderDirection(changedDirection: string) {
		const direction = this.isDefaultOrderBy ? SortDirection.DEFAULT : changedDirection;

		switch(direction) {
			case SortDirection.ASC:
				this.params.orderByType = SortDirection.DESC;
				break;
			case SortDirection.DESC:
				this.params.orderByType = SortDirection.ASC;
				break;
			default:
				this.resetOrderBy();
		}

		this.isDefaultOrderBy = true;
	}

	initData() {
		if(!this.params.tableName && !this.params.limit) {
			return;
		}

		if(this.currentParams.orderBy && this.currentParams.tableName !== this.params.tableName) {
			this.resetOrderBy();
		}

		this.loading = true;
		this.redshiftDataTableService
			.getList(this.params)
			.subscribe(
				resp => {
					this.dataTable = new RedshiftDataTableDto(resp);
					this.dataErrorMsg = '';
					this.tableTitlesList = this.dataTable.rows[0];
					this.currentParams = new RedshiftDataTableQueriesDto(this.params);
					this.loading = false;
				},
				err => {
					this.dataErrorMsg = err.error.message;
					this.loading = false;
				}
			);
	}

	orderBy(orderBy: string, direction: string) {
		if(this.currentParams.tableName !== this.params.tableName) {
			return;
		}

		orderBy === this.params.orderBy ? this.switchOrderDirection(direction) : this.setOrderBy(orderBy, direction);
		this.initData();
	}

	selectTable(val: DropdownItemPickerModel) {
		this.params.tableName = val.name;
	}

	selectSchema(val: DropdownItemPickerModel) {
		const schemaName = val.name;
		this.params.schemaName = schemaName;
		this.composeTableList(schemaName);
	}

	changeLimit(val: number) {
		this.params.limit = val;
	}

	download() {
		this.downloadsFileParams.push(this.params);
		this.selectTab(1);
	}

	autoSave(input: HTMLInputElement) {
		this.isAutoSave = input.checked;
	}

	selectTab(tabId: number) {
		this.viewerTabs.tabs[tabId].active = true;
	}
}
