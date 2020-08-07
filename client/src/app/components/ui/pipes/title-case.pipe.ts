import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'titlecase',
	pure: false
})

export class TitleCasePipe implements PipeTransform {
	transform(input: string): string {
		if(!input) {
			return '';
		} else {
			return input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substring(1).toLowerCase() ));
		}
	}
}

