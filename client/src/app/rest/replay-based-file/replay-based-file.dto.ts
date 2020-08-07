export class ReplayBasedFileDto {
	message: string;
	status: string;

	constructor(data: ReplayBasedFileDto) {
		if(!data) {
			return;
		}

		this.message = data.message;
		this.status = data.status;
	}
}