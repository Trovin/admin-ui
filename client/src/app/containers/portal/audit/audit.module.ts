import { NgModule } from '@angular/core';
import { SharedModule } from '@components/shared/shared.module';

import { AuditRoutingModule } from './audit-routing.module';

import { AuditComponent } from './audit.component';

@NgModule({
	imports: [
		SharedModule,

		AuditRoutingModule
	],
	declarations: [
		AuditComponent
	],
	exports: [
		AuditComponent
	]
})

export class AuditModule {}
