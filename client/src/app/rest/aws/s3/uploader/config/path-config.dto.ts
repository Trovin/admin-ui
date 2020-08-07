export class S3UploaderPathConfigDto {
	fileNames?: string[];
	fileExtension?: string[];
	path: string;
	validation?: boolean;

	constructor(data?: S3UploaderPathConfigDto) {
		if(!data) {
			return;
		}

		this.fileNames = data.fileNames;
		this.path = data.path;
		this.validation = data.validation;
		this.fileExtension = data.fileExtension;
	}
}
