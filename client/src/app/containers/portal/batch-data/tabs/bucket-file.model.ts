import { BatchDataBucketFileDto } from '@rest/batch-data/bucket-files';
import { QueryParamsType } from '@rest/shared/query-params.type';

export class InputFileModel extends BatchDataBucketFileDto {
	auditLink?: string;
	reconciliationFileInProcess?: boolean;
	reconciliationFolderInProcess?: boolean;
	selected?: boolean;
	auditQueryParams?: QueryParamsType;
	isReconciliationPermitted?: boolean;
	reconTooltipText?: string;

	constructor(data?: InputFileModel) {
		super(data);

		if(!data) {
			return;
		}

		this.auditLink = data.auditLink;
		this.reconciliationFileInProcess = data.reconciliationFileInProcess;
		this.reconciliationFolderInProcess = data.reconciliationFolderInProcess;
		this.selected = data.selected;
		this.auditQueryParams = data.auditQueryParams;
		this.isReconciliationPermitted = data.isReconciliationPermitted;
		this.reconTooltipText = data.reconTooltipText;
	}
}
