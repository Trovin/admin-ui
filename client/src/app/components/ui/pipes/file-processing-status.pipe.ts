import { Pipe, PipeTransform } from '@angular/core';

import { FileProcessStatus } from '@enums/file-process-status.enum';

@Pipe({
	name: 'fileProcessingStatus'
})
export class FileProcessingStatusPipe implements PipeTransform {
	transform(input: FileProcessStatus): string {
		return input ? FileProcessStatus.getAliasUI(input) : '';
	}
}

