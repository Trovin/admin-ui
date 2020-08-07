export interface IDidixOperationsFctProductPlanColumnResponseDto {
	weekId: number;
	fiscalYearId: number;
	productId: number;
	planAmount: number;
	targetAmount: number;
	currencyId: number;
}

export interface IDidixOperationsFctProductPlanRowResponseDto {
	periodId: number;
}

export class DidixOperationsFctProductPlanResponseDto {
	row: IDidixOperationsFctProductPlanRowResponseDto;
	columns: IDidixOperationsFctProductPlanColumnResponseDto[];

	constructor(data?: DidixOperationsFctProductPlanResponseDto) {
		if(!data) {
			return;
		}

		this.row = data.row;
		this.columns = data.columns;
	}
}
