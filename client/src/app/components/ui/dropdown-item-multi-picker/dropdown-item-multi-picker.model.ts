export type DropdownItemMultiPickerValueModel<T = string|number> = {
	[key: string]: T
};

export class DropdownItemMultiPickerModel {
	id?: number;
	name: string;
	value?: DropdownItemMultiPickerValueModel|number|string;
	helpText?: string;
	checked?: boolean;
	highlighted?: boolean;

	constructor(data?: DropdownItemMultiPickerModel) {
		if(!data) {
			return;
		}
		this.id = data.id;
		this.name = data.name;
		this.value = data.value;
		this.helpText = data.helpText;
		this.checked = data.checked;
		this.highlighted = data.highlighted;
	}
}
