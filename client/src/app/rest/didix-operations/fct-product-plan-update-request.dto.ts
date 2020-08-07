import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
export class DidixOperationsFctProductPlanUpdateRequestDto {
	operation: ModalActionsEnum;
	productId: number;
	weekId: number;
	planAmount: number;
	targetAmount: number;
	fiscalYearId: number;

	userId?: string;
	userEmail?: string;
	userName?: string;

	constructor(data?: DidixOperationsFctProductPlanUpdateRequestDto) {
		if(!data) {
			return;
		}

		this.operation = data.operation;
		this.productId = data.productId;
		this.weekId = data.weekId;
		this.planAmount = data.planAmount;
		this.targetAmount = data.targetAmount;
		this.fiscalYearId = data.fiscalYearId;

		this.userId = data.userId;
		this.userEmail = data.userEmail;
		this.userName = data.userName;
	}
}
