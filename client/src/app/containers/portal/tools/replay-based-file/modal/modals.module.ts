import { NgModule } from '@angular/core';

import { ConfirmationModule } from '@components/ui/confirmation/confirmation.module';

import { ModalsService } from './modals.service';

@NgModule({
	imports: [
		ConfirmationModule
	],
	providers: [
		ModalsService
	]
})

export class ModalsModule {}
