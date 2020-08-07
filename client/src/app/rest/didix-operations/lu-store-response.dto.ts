export class DidixOperationsLuStoreResponseDto {
	storeId: string;
	storeDesc: string;
	city: string;
	postalCode: string;
	countryId: string;
	b2b: string;
	channel: string;

	constructor(data?: DidixOperationsLuStoreResponseDto) {
		if(!data) {
			return;
		}

		this.storeId = data.storeId;
		this.storeDesc = data.storeDesc;
		this.city = data.city;
		this.postalCode = data.postalCode;
		this.countryId = data.countryId;
		this.b2b = data.b2b;
		this.channel = data.channel;
	}
}
