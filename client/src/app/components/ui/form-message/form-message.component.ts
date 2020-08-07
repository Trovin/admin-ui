import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormValidationService } from './form-validation.service';

@Component({
	selector: 'form-message',
	templateUrl: './form-message.html'
})
export class FormMessageComponent {
	@Input() control: FormControl;
	@Input() customErrorMessage: string;

	get message() {
		for (const propertyName in this.control.errors) {
			if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
				let errorMessage = FormValidationService.getErrorMessageValidator(propertyName);
				if(propertyName !== 'required' && this.customErrorMessage) {
					errorMessage = this.customErrorMessage;
				}
				return errorMessage;
			}
		}
		return '';
	}
}
