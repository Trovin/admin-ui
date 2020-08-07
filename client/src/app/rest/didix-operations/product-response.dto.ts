export class DidixOperationsProductResponseDto {
	productId: number;
	productDesc: string;
	currencyId: string;

	constructor(data?: DidixOperationsProductResponseDto) {
		if(!data) {
			return;
		}

		this.productId = data.productId;
		this.productDesc = data.productDesc;
		this.currencyId = data.currencyId;
	}
}
