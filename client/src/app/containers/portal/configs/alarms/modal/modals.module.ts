import { NgModule } from '@angular/core';

import { ConfirmModalModule } from './confirm/confirm-modal.module';
import { ActionModalModule } from './action/action-modal.module';


@NgModule({
	imports: [
		ConfirmModalModule,
		ActionModalModule
	]
})

export class ModalsModule {}
