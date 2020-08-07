import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PaginatorModule } from '@components/ui/paginator/paginator.module';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes';

import { ReconciliationFormModule } from './../form/form.module';

import { ReconciliationDetailsComponent } from './details.component';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		PipesModule,

		PaginatorModule,

		ReconciliationFormModule
	],
	declarations: [
		ReconciliationDetailsComponent
	],
	exports: [
		ReconciliationDetailsComponent
	]
})

export class ReconciliationDetailsModule {}
