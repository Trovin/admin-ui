export class DidixOperationsLuTransactionResponseDto {
	article: string;
	articleDesc: string;
	creditorDesc: string;
	redeemAmt: string;
	redeemDate: Date;
	creditor: number;
	productId: number;
	productDesc: string;
	code: string;

	constructor(data?: DidixOperationsLuTransactionResponseDto) {
		if(!data) {
			return;
		}

		this.article = data.article;
		this.articleDesc = data.articleDesc;
		this.creditorDesc = data.creditorDesc;
		this.productDesc = data.productDesc;
		this.productId = data.productId;
		this.redeemAmt = data.redeemAmt;
		this.redeemDate = data.redeemDate;
		this.creditor = data.creditor;
		this.code = data.code;
	}
}
