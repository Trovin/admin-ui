import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SharedModule } from '@components/shared/shared.module';

import { DidixOperationsListComponent } from './list.component';
import { DidixOperationsListRoutingModule } from './list-routing.module';


@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,
		PageHeaderModule,

		DidixOperationsListRoutingModule
	],
	declarations: [
		DidixOperationsListComponent
	],
	exports: [
		DidixOperationsListComponent
	]
})

export class DidixOperationsListModule {}
