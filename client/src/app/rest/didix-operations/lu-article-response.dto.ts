export class DidixOperationsLuArticleResponseDto {
	article: string;
	articleDesc: string;
	productId: number;
	productDesc: string;
	discontinued: number;
	startDate: Date;

	constructor(data?: DidixOperationsLuArticleResponseDto) {
		if(!data) {
			return;
		}

		this.article = data.article;
		this.articleDesc = data.articleDesc;
		this.productId = data.productId;
		this.productDesc = data.productDesc;
		this.discontinued = data.discontinued;
		this.startDate = data.startDate;
	}
}
