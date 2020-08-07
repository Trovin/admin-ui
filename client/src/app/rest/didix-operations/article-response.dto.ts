export class DidixOperationsArticleResponseDto {
	article: string;
	articleDesc: string;

	constructor(data?: DidixOperationsArticleResponseDto) {
		if(!data) {
			return;
		}

		this.article = data.article;
		this.articleDesc = data.articleDesc;
	}
}
