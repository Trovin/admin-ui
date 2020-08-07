export class DidixOperationsLuCardRequestDto {
	article: string;
	productId: number;
	productDesc: string;
	debtor: string;
	salesDate: string;
	salesPrice: number;
	salesAmountEuro: number;
	code: string;
	page: number;
	itemsPerPage: number;

	constructor(data?: DidixOperationsLuCardRequestDto) {
		if(!data) {
			return;
		}

		this.article = data.article;
		this.productDesc = data.productDesc;
		this.productId = data.productId;
		this.debtor = data.debtor;
		this.salesDate = data.salesDate;
		this.salesPrice = data.salesPrice;
		this.salesAmountEuro = data.salesAmountEuro;
		this.code = data.code;
		this.page = data.page;
		this.itemsPerPage = data.itemsPerPage;
	}
}
