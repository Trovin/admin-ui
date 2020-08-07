import { Injectable } from '@angular/core';

import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Injectable()
export class FormValidationService {
	static getErrorMessageValidator(validatorName: string) {
		const config = {
			'required': 'Required',
			'email': 'Invalid email address',
			'jsonInvalid': 'Invalid Json',
			'invalidDate': 'Invalid Date',
			'invalidText': 'Invalid text',
			'maxlength': 'Invalid max length'
		};

		return config[validatorName];
	}

	static getDateValidator(format = 'yyyy-mm-dd') {
		return (control:FormControl) => {
			const val = moment(control.value).format(format);

			if (!moment(val, format, true).isValid()) {
				return { 'invalidDate': true };
			}

			return null;
		};
	}

	static geStringValidator(stringValues: string[] = []) {
		return (control:FormControl) => {
			const val = control.value;
			const strings = stringValues || [];

			if (!~strings.indexOf(val)) {
				return { 'invalidText': true };
			}

			return null;
		};
	}


	//
	// static getDateValidator(control: FormControl): { [key: string]: any } {
	// 	const ptDatePattern = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
	//
	// 	if(!control.value.match(ptDatePattern)) {
	// 		return {ptDate: true};
	// 	}
	//
	// 	return null;
	// }

	// static usDate(control: FormControl): { [key: string]: any } {
	// 	let usDatePattern = /^02\/(?:[01]\d|2\d)\/(?:19|20)(?:0[048]|[13579][26]|[2468][048])|(?:0[13578]|10|12)\/(?:[0-2]\d|3[01])\/(?:19|20)\d{2}|(?:0[469]|11)\/(?:[0-2]\d|30)\/(?:19|20)\d{2}|02\/(?:[0-1]\d|2[0-8])\/(?:19|20)\d{2}$/;
	//
	// 	if (!control.value.match(usDatePattern))
	// 		return { "usDate": true };
	//
	// 	return null;
	// }
}
