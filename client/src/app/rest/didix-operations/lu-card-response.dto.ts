export class DidixOperationsLuCardResponseDto {
	article: string;
	articleDesc: string;
	productId: number;
	productDesc: string;
	debtor: string;
	debtorDesc: string;
	salesDateId: Date;
	salesPrice: number;
	code: string;

	constructor(data?: DidixOperationsLuCardResponseDto) {
		if(!data) {
			return;
		}

		this.article = data.article;
		this.articleDesc = data.articleDesc;
		this.productDesc = data.productDesc;
		this.productId = data.productId;
		this.debtor = data.debtor;
		this.debtorDesc = data.debtorDesc;
		this.salesDateId = data.salesDateId;
		this.salesPrice = data.salesPrice;
		this.code = data.code;
	}
}
