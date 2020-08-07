export class DidixOperationsLuContentTypeResponseDto {
	contenttypeId: number;
	contentTypeDesc: string;

	constructor(data?: DidixOperationsLuContentTypeResponseDto) {
		if(!data) {
			return;
		}

		this.contenttypeId = data.contenttypeId;
		this.contentTypeDesc = data.contentTypeDesc;
	}
}
