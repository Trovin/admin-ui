import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'replace'
})
export class ReplacePipe implements PipeTransform {
	transform(value: string, searchValue = '', replaceValue = ''): string {
		return value ? value.replace(searchValue, replaceValue) : null;
	}
}

