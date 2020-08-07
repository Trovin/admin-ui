export class DidixOperationsCreditorResponseDto {
	creditorId: number;
	creditorDesc: string;

	constructor(data?: DidixOperationsCreditorResponseDto) {
		if(!data) {
			return;
		}

		this.creditorId = data.creditorId;
		this.creditorDesc = data.creditorDesc;
	}
}
