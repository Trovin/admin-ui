import { FileValidateModel } from './../shared/validate/file-validate.model';

export class FormParamsModel extends FileValidateModel {
	bucket?: string;
	path?: string;

	constructor(data?: FormParamsModel) {
		super(data);

		if(!data) {
			return;
		}

		this.bucket = data.bucket;
		this.path = data.path;
	}
}
