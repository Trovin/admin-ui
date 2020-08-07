import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
export class DidixOperationsCreateManualCardRequestDto {
	operation: ModalActionsEnum;
	article: string;
	debtor: string;
	salesPrice: number;
	salesDate: string;
	salesTime: string;
	code: string;
	productId: number;

	userId?: string;
	userEmail?: string;
	userName?: string;

	constructor(data?: DidixOperationsCreateManualCardRequestDto) {
		if(!data) {
			return;
		}

		this.operation = data.operation;
		this.article = data.article;
		this.debtor = data.debtor;
		this.salesPrice = data.salesPrice;
		this.salesDate = data.salesDate;
		this.salesTime = data.salesTime;
		this.productId = data.productId;
		this.code = data.code;

		this.userId = data.userId;
		this.userEmail = data.userEmail;
		this.userName = data.userName;
	}
}
