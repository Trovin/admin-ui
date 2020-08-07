export class DidixOperationsFctProductPlanRequestDto {
	productId: number;
	fiscalYearId: number;

	constructor(data?: DidixOperationsFctProductPlanRequestDto) {
		if(!data) {
			return;
		}

		this.productId = data.productId;
		this.fiscalYearId = data.fiscalYearId;
	}
}
