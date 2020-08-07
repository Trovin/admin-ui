import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { TreeviewItem } from 'ngx-treeview';

import { Subject, Subscription } from 'rxjs';

import { ParamsService } from './shared/params.service';
import { BaseParamsModel } from './shared/params-base.model';

import { ConfigStorageService, ConfigStorageItemDto, ConfigStorageStructureDto, ConfigStorageSourceListQueriesDto, ConfigStorageSourceItemDto } from '@rest/config-storage';

interface ISelectValue {
	schemaName: string;
	tableName: string;
}

@Component({
	selector: 'redshift-tables-storage',
	templateUrl: './redshift-tables.html',
	styleUrls: ['./redshift-tables.scss'],
	providers: [
		ParamsService,
		ConfigStorageService
	]
})

export class RedshiftTablesComponent implements OnInit, OnDestroy {
	private sub = new Subscription();
	isRouterNavigated = false;

	params: BaseParamsModel = new BaseParamsModel();

	loadingSources = false;
	loadingStructure = false;

	sources: ConfigStorageItemDto[] = [];
	structure: TreeviewItem[] = [];
	selected: ISelectValue[] = [];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
		private paramsService: ParamsService,
		private configStorageService: ConfigStorageService
	) {}

	ngOnInit() {
		this.isRouterNavigated = this.router.navigated;

		const params = this.paramsService.getSnapshotQueryParams();
		this.fetchStructure(params);

		const sub = this.paramsService
			.getParamsSubj()
			.subscribe((params: BaseParamsModel) => {
				this.composeParams(params);
				this.selected = this.getSelectedItems(params.selected);

				if(params.selected) {
					this.configUrlSubj().subscribe(() => this.fetch());
				}
			});

		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	goToBack() {
		this.location.back();
	}

	onSelected(values: ISelectValue[]) {
		this.selected = values;
		this.params.selected = this.setSelectedItems(values);
	}

	refresh() {
		this.paramsService.setParamsSubj(this.params);
	}

	private fetchStructure(params: BaseParamsModel) {
		const selected = this.getSelectedItems(params.selected);
		this.loadingStructure = true;

		const sub = this.configStorageService
			.getStructList()
			.subscribe(
				data => {
					this.loadingStructure = false;
					this.structure = this.composeStructureList(data, selected);
				},
				e => {
					this.loadingStructure = false;
				}
			);

		this.sub.add(sub);
	}

	fetch() {
		this.loadingSources = true;
		const queries = new ConfigStorageSourceListQueriesDto({
			body: this.selected
		});

		const sub = this.configStorageService
			.getSourceList(queries)
			.subscribe(
				data => {
					this.loadingSources = false;

					if(!data) {
						this.sources = [];
						return;
					}

					this.sources = data.map(item => new ConfigStorageSourceItemDto({
						schemaName: item.schemaName,
						tableName: item.tableName,
						...item
					}));
				},
				e => {
					this.loadingSources = false;
				}
			);

		this.sub.add(sub);
	}

	private setSelectedItems(values: ISelectValue[]): string[] {
		if(!values || !values.length) {
			return null;
		}

		return values.map(val => `${val.schemaName},${val.tableName}`);
	}

	private getSelectedItems(values: string[]): ISelectValue[] {
		if(!values || !values.length) {
			return [];
		}

		return values.map(val => {
			const separatedValues = val.split(',');
			if(separatedValues[0] && separatedValues[1]) {
				return {schemaName: separatedValues[0], tableName: separatedValues[1]};
			}
		});
	}

	private composeStructureList(list: ConfigStorageStructureDto[], selected: ISelectValue[]): TreeviewItem[] {
		return list.map(item => {
			const selectedValues = selected.filter(e => e.schemaName === item.schemaName);
			const structure = new TreeviewItem({
				text: item.schemaName,
				value: item.schemaName,
				checked: false,
				collapsed: true,
				children: this.composeTableList(item)
			});

			if(selectedValues.length) {
				structure.collapsed = false;
				structure.children.forEach(children => children.checked = selectedValues.some(e => e.tableName === children.text));
				structure.correctChecked();
			}

			return structure;
		});
	}

	private composeTableList(item: ConfigStorageStructureDto): TreeviewItem[] {
		return item.tableList.map(tableName => {
			return new TreeviewItem({
				text: tableName,
				value: {
					schemaName: item.schemaName,
					tableName: tableName
				},
				checked: false
			});
		});
	}

	private configUrlSubj() {
		const subj = new Subject<never>();

		const queryParams: NavigationExtras = {
			queryParams: {
				'selected': this.params.selected
			},
			queryParamsHandling: 'merge',
			relativeTo: this.route,
			replaceUrl: true
		};

		this.router.navigate(['.'], queryParams)
			.then(() => {
				subj.next();
				subj.complete();
			});

		return subj;
	}

	private composeParams(params: BaseParamsModel) {
		this.params = new BaseParamsModel(params);
	}
}
