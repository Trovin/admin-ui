import { Injectable } from '@angular/core';

import { FileValidateModel, FileValidateResultModel } from './file-validate.model';

@Injectable()
export class FileValidateService {
	validate(file: File, rules: FileValidateModel):FileValidateResultModel {
		const fileExtension = file.name.split('.').pop();
		const fileName = file.name.replace('.' + fileExtension, '');

		return new FileValidateResultModel({
			isFileNameValid: this.checkFile(fileName, rules.fileNames),
			isFileExtensionValid: this.checkFile(fileExtension, rules.fileExtension)
		});
	}

	private checkFile(rule: string, rules: string[]): boolean {
		if(!rules || !rules.length) {
			return true;
		}

		return rules.some(i => i === rule);
	}
}
