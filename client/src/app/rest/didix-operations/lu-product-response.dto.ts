export class DidixOperationsLuProductResponseDto {
	productDesc: string;
	productId: number;
	contentTypeId: number;
	sortId: number;
	boxsetyn: number;
	discontinuedyn: number;
	prepaidyn: number;
	countryId: string;
	image: string;
	currencyId: string;
	contentTypeDesc: string;

	constructor(data?: DidixOperationsLuProductResponseDto) {
		if(!data) {
			return;
		}

		this.productDesc = data.productDesc;
		this.productId = data.productId;
		this.contentTypeId = data.contentTypeId;
		this.boxsetyn = data.boxsetyn;
		this.discontinuedyn = data.discontinuedyn;
		this.prepaidyn = data.prepaidyn;
		this.sortId = data.sortId;
		this.countryId = data.countryId;
		this.image = data.image;
		this.currencyId = data.currencyId;
		this.contentTypeDesc = data.contentTypeDesc;
	}
}
