import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
export class DidixOperationsLuArticleUpdateRequestDto {
	operation: ModalActionsEnum;
	article: string;
	articleDesc: string;
	productDesc: string;
	productId: number;
	discontinued: number;
	startDate: Date;

	userId?: string;
	userEmail?: string;
	userName?: string;

	constructor(data?: DidixOperationsLuArticleUpdateRequestDto) {
		if(!data) {
			return;
		}

		this.operation = data.operation;
		this.article = data.article;
		this.articleDesc = data.articleDesc;
		this.productId = data.productId;
		this.productDesc = data.productDesc;
		this.discontinued = data.discontinued;
		this.startDate = data.startDate;
		this.userId = data.userId;
		this.userEmail = data.userEmail;
		this.userName = data.userName;
	}
}
