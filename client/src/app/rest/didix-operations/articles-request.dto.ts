export class DidixOperationsArticleRequestDto {
	productId: number;

	constructor(data?: DidixOperationsArticleRequestDto) {
		if(!data) {
			return;
		}

		this.productId = data.productId;
	}
}
