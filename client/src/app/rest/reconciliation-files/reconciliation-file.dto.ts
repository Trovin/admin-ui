export class ReconciliationFileDto {
	message: string;

	constructor(data?: ReconciliationFileDto) {
		if(!data) {
			return;
		}

		this.message = data.message;
	}
}
