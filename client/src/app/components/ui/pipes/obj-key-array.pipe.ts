import { PipeTransform, Pipe } from '@angular/core';
@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
	transform(value, args:string[]): any {
		const keys = [];
		for (const item in value) {
		keys.push(item);
		}
		return keys;
	}
}
