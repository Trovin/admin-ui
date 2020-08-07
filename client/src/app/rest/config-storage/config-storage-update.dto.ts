export class ConfigStorageUpdateDto {
	status: string;
	message: string;
	objectKey: string;

	constructor(data?: ConfigStorageUpdateDto) {
		if(!data) {
			return;
		}

		this.status = data.status;
		this.message = data.message;
		this.objectKey = data.objectKey;
	}
}
