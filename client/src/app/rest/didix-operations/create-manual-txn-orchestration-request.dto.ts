import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
export class DidixOperationsCreateManualTxnRequestDto {
	operation: ModalActionsEnum;
	article: string;
	redeemAmt: string;
	redeemDate: string;
	creditor: number;
	code: string;
	productId: number;

	userId?: string;
	userEmail?: string;
	userName?: string;

	constructor(data?: DidixOperationsCreateManualTxnRequestDto) {
		if(!data) {
			return;
		}

		this.operation = data.operation;
		this.article = data.article;
		this.redeemAmt = data.redeemAmt;
		this.redeemDate = data.redeemDate;
		this.productId = data.productId;
		this.creditor = data.creditor;
		this.code = data.code;

		this.userId = data.userId;
		this.userEmail = data.userEmail;
		this.userName = data.userName;
	}
}
