import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@components/shared/shared.module';

import { AuditBatchOutputComponent } from './output.component';

@NgModule({
	imports: [
		SharedModule,
		FormsModule
	],
	declarations: [
		AuditBatchOutputComponent
	],
	exports: [
		AuditBatchOutputComponent
	]
})

export class AuditBatchOutputModule {}
