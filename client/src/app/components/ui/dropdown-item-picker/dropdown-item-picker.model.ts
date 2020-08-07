export type DropdownItemPickerModelValue<T = string|number> = {
	[key: string]: T
};

export class DropdownItemPickerModel {
	name: string;
	helpText?: string;
	id?: number;
	value?: DropdownItemPickerModelValue|string|number|boolean;
	checked?: boolean;
	highlighted?: boolean;

	constructor(data?: DropdownItemPickerModel) {
		if(!data) {
			return;
		}
		Object.assign(this, data);
	}
}
