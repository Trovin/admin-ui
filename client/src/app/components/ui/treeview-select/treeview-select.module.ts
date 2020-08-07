import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreeviewModule } from 'ngx-treeview';

import { TreeviewSelectComponent } from './treeview-select.component';

@NgModule({
	imports: [
		CommonModule,
		TreeviewModule.forRoot()
	],
	declarations: [
		TreeviewSelectComponent
	],
	exports: [
		TreeviewSelectComponent
	]
})

export class TreeviewSelectModule { }
