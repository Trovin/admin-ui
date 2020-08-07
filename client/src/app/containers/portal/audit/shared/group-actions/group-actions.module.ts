import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { ConfirmModalModule } from './modals/confirm/confirm-modal.module';
import { AuditActionsComponent } from './group-actions.component';

import { AuditHideService } from '@rest/audit-hide';
import { AuditReplayService } from '@rest/audit-replay';
import { AuditHideAllService } from '@rest/audit-hide-all';
import { AuditReplayAllService } from '@rest/audit-replay-all';
import { AuditFilesCountService } from '@rest/audit-files-count';


@NgModule({
	imports: [
		SharedModule,
		ConfirmModalModule,
		BsDropdownModule.forRoot()
	],
	declarations: [
		AuditActionsComponent
	],
	exports: [
		AuditActionsComponent
	],
	providers: [
		AuditHideService,
		AuditReplayService,
		AuditHideAllService,
		AuditReplayAllService,
		AuditFilesCountService
	]
})

export class AuditActionsModule {}
