import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SharedModule } from '@components/shared/shared.module';

import { DiffModalModule } from './modal/diff/diff-modal.module';

import { RedshiftDiffToolComponent } from './redshift-diff-tool.component';
import { RedshiftDiffToolRoutingModule } from './redshift-diff-tool-routing.module';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		ReactiveFormsModule,
		DiffModalModule,
		PageHeaderModule,

		RedshiftDiffToolRoutingModule
	],
	declarations: [
		RedshiftDiffToolComponent
	],
	exports: [
		RedshiftDiffToolComponent
	]
})

export class RedshiftDiffToolModule {}
