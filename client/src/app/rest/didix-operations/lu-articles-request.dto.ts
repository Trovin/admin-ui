export class DidixOperationsLuArticlesRequestDto {
	productId: number;

	constructor(data?: DidixOperationsLuArticlesRequestDto) {
		if(!data) {
			return;
		}

		this.productId = data.productId;
	}
}
