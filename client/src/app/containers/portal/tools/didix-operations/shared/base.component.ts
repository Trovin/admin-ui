import { IViewModal } from '@components/ui/modal-v2/modal-v2.service';
import { PaginatorV2Service } from '@components/ui/paginator-v2/paginator.service';

import { HttpStatuses } from '@enums/http-statuses.enum';

import { DidixOperationsService } from '@rest/didix-operations/didix-operations.service';
import { DidixOperationsHistoryRequestDto } from '@rest/didix-operations/history-request.dto';
import { DidixOperationsHistoryResponseDto } from '@rest/didix-operations/history-response.dto';

export abstract class DidixOperationsBaseComponent<T extends IViewModal> {
	httpStatuses = HttpStatuses;
	jobAliasName = '';
	histories: DidixOperationsHistoryResponseDto[] = [];
	historyParams = new DidixOperationsHistoryRequestDto();
	loadingHistory = false;

	protected constructor(
		public modalsService: T,
		public pagination: PaginatorV2Service,
		public service: DidixOperationsService
	) {}

	initHistory() {
		this.loadingHistory = true;

		this.service
			.getHistory(this.jobAliasName, this.historyParams)
			.subscribe(
				resp => {
					this.loadingHistory = false;
					this.histories = resp.content;
					this.pagination.setSubj({
						page: resp.pagination.page,
						itemsPerPage: resp.pagination.itemsPerPage,
						previous: resp.pagination.previous,
						next: resp.pagination.next,
						totalItems: resp.pagination.totalItems,
						totalPages:resp.pagination.totalPages
					});
				},
				() => this.loadingHistory = false
			);
	}

	openViewModal(item: string, isJson = false) {
		if(!item) {
			return;
		}
		const data = isJson ? JSON.parse(item) : item;
		this.modalsService.openViewModal(data, isJson);
	}

	protected pageChanged() {
		this.historyParams = new DidixOperationsHistoryRequestDto({ page: this.pagination.get().page, itemsPerPage: this.pagination.get().itemsPerPage });
		this.initHistory();
	}

	protected configPaginationData(data: {[key: string]: number}) {
		this.pagination.setSubj(data);
	}

	protected abstract goToBack();
}
