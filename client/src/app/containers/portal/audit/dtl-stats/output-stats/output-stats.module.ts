import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@components/shared/shared.module';

import { AuditDTLOutputStatsComponent } from './output-stats.component';

@NgModule({
	imports: [
		SharedModule,
		FormsModule
	],
	declarations: [
		AuditDTLOutputStatsComponent
	],
	exports: [
		AuditDTLOutputStatsComponent
	]
})

export class AuditDTLOutputStatsModule {}
