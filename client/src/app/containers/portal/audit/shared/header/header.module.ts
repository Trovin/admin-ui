import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SharedModule } from '@components/shared/shared.module';

import { AuditHeaderComponent } from './header.component';

@NgModule({
	imports: [
		SharedModule,
		RouterModule,

		PageHeaderModule
	],
	declarations: [
		AuditHeaderComponent
	],
	exports: [
		AuditHeaderComponent
	]
})

export class AuditHeaderModule {}
