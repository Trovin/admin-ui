import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PaginationModule } from 'ngx-bootstrap/pagination';

import { SharedModule } from '@components/shared/shared.module';

import { PaginatorV2Component } from './paginator.component';
import { PaginatorV2Service } from './paginator.service';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,

		PaginationModule.forRoot()
	],
	declarations: [
		PaginatorV2Component
	],
	exports: [
		PaginatorV2Component
	],
	providers: [
		PaginatorV2Service
	]
})
export class PaginatorV2Module {}
