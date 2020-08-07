export class S3CheckExistFileDto {
	key: string;
	lastModified: string;

	constructor(data?: S3CheckExistFileDto) {
		if(!data) {
			return;
		}

		this.key = data.key;
		this.lastModified = data.lastModified;
	}
}
