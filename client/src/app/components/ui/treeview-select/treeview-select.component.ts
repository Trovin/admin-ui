import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

interface ISelectValue {
	[key: string]: string;
}

@Component({
	selector: 'treeview-select',
	templateUrl: './treeview-select.component.html',
	styleUrls: ['./treeview-select.component.scss']
})
export class TreeviewSelectComponent {
	@Input() config: TreeviewConfig;
	@Input() items: TreeviewItem[];
	@Output() valueChange = new EventEmitter<ISelectValue[]>();

	constructor() {
		this.config = TreeviewConfig.create({
			hasAllCheckBox: false,
			hasCollapseExpand: false,
			hasFilter: true,
			maxHeight: 400
		});
	}

	select(values: ISelectValue[]) {
		this.valueChange.emit(values);
	}
}
