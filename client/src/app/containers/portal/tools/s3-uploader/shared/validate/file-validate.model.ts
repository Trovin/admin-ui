export class FileValidateModel {
	validation?: boolean;
	fileNames?: string[];
	fileExtension?: string[];

	constructor(data?: FileValidateModel) {
		if(!data) {
			return;
		}

		this.validation = data.validation;
		this.fileNames = data.fileNames;
		this.fileExtension = data.fileExtension;
	}
}

export class FileValidateResultModel {
	isFileNameValid = true;
	isFileExtensionValid = true;

	constructor(data?: FileValidateResultModel) {
		if(!data) {
			return;
		}

		this.isFileNameValid = data.isFileNameValid;
		this.isFileExtensionValid = data.isFileExtensionValid;
	}
}
