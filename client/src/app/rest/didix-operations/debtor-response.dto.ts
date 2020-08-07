export class DidixOperationsDebtorResponseDto {
	debtorId: string;
	debtorDesc: string;

	constructor(data?: DidixOperationsDebtorResponseDto) {
		if(!data) {
			return;
		}

		this.debtorId = data.debtorId;
		this.debtorDesc = data.debtorDesc;
	}
}
