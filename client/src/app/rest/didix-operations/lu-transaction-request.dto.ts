export class DidixOperationsLuTransactionRequestDto {
	article: string;
	productId: number;
	redeemAmt: string;
	redeemDate: string;
	creditor: number;
	page: number;
	itemsPerPage: number;

	constructor(data?: DidixOperationsLuTransactionRequestDto) {
		if(!data) {
			return;
		}

		this.article = data.article;
		this.productId = data.productId;
		this.redeemAmt = data.redeemAmt;
		this.redeemDate = data.redeemDate;
		this.creditor = data.creditor;
		this.page = data.page;
		this.itemsPerPage = data.itemsPerPage;
	}
}
