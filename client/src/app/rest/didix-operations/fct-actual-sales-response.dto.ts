export interface IDidixOperationsActualSalesColumnResponseDto {
	weekId: number;
	salesAmount: number;
}

export interface IDidixOperationsActualSalesRowResponseDto {
	periodId: number;
	productId: number;
}

export class DidixOperationsActualSalesResponseDto {
	row: IDidixOperationsActualSalesRowResponseDto;
	columns: IDidixOperationsActualSalesColumnResponseDto[];

	constructor(data?: DidixOperationsActualSalesResponseDto) {
		if(!data) {
			return;
		}

		this.row = data.row;
		this.columns = data.columns;
	}
}
