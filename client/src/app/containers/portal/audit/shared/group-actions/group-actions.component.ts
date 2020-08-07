import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';

import { alertsService } from '@components/ui';
import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { AuditActionsService } from './group-actions.service';
import { ModalsService } from './modals/modals.service';

import { AuditStatsBaseDto, AuditStatsBaseQueriesDto } from '@rest/audit/shared/stats-base';

@Component({
	selector: 'audit-actions',
	templateUrl: './group-actions.html',
	providers: [
		AuditActionsService,
		ModalsService
	]
})

export class AuditActionsComponent implements OnInit, OnDestroy {
	@Output() changed = new EventEmitter<never>();
	@Input() process: string;
	@Input() container: Containers;
	@Input() loading: boolean;
	@Input() params: AuditStatsBaseQueriesDto;
	@Input() items: AuditStatsBaseDto[] = [];

	private subj = new Subscription();
	private replayMsg = 'Do you want to send files to re-play?';
	private hideMsg = 'Do you want to send files to hide?';

	permission = PermissionAction;

	statuses = {
		hideFilesPerPageInProcess: false,
		replayFilesPerPageInProcess: false,
		replayAllFilesInProcess: false,
		hideAllFilesInProcess: false
	};

	constructor(
		private auditActionsService: AuditActionsService,
		private modalsService: ModalsService
	) {}

	ngOnInit() {
		this.auditActionsService.setProcessName(this.process);
	}

	ngOnDestroy() {
		this.subj.unsubscribe();
	}

	hideItemsPerPage() {
		const calculatedFilesCount = this.auditActionsService.getCalculatedFileCount(this.items);

		this.modalsService.openConfirmActionPerPageModal(this.hideMsg, calculatedFilesCount)
			.subscribe(status => {
				if(status) {
					const sub = this.auditActionsService.hideFilesPerPage(this.items);
					this.triggerAction('hideFilesPerPageInProcess', sub);
				}
			});
	}

	hideAll() {
		const observe = this.auditActionsService.getFileCountObserve(this.params);

		this.modalsService.openConfirmAllModal(this.hideMsg, observe)
			.subscribe(status => {
				if(status) {
					const sub = this.auditActionsService.hideAll(this.params);
					this.triggerAction('hideAllFilesInProcess', sub);
				}
			});
	}

	replayItemsPerPage() {
		const calculatedFilesCount = this.auditActionsService.getCalculatedFileCount(this.items);

		this.modalsService.openConfirmActionPerPageModal(this.replayMsg, calculatedFilesCount)
			.subscribe(status => {
				if(status) {
					const sub = this.auditActionsService.replayFilesPerPage(this.items);
					this.triggerAction('replayFilesPerPageInProcess', sub);
				}
			});
	}

	replayAll() {
		const observe = this.auditActionsService.getFileCountObserve(this.params);

		this.modalsService.openConfirmAllModal(this.replayMsg, observe)
			.subscribe(status => {
				if(status) {
					const sub = this.auditActionsService.replayAll(this.params);
					this.triggerAction('replayAllFilesInProcess', sub);
				}
			});
	}

	private triggerAction(status: string, sub: Subject<string>) {
		this.statuses[status] = true;

		sub.subscribe(
			r => {
				this.statuses[status] = false;
				alertsService.success(r);
				this.changed.emit();
			},
			() => {
				this.statuses[status] = false;
			});

		this.subj.add(sub);
	}
}
