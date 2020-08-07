import { NgModule } from '@angular/core';

import { ConfirmationModule } from '@components/ui/confirmation/confirmation.module';

import { ExecuteModalModule } from './execute/execute-modal.module';
import { ErrorModalModule } from './error/error-modal.module';

import { ModalsService } from './modals.service';

@NgModule({
	imports: [
		ConfirmationModule,
		ExecuteModalModule,
		ErrorModalModule
	],
	providers: [
		ModalsService
	]
})

export class ModalsModule {}
