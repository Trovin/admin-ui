import {
	Component,
	Input,
	Output,
	OnInit,
	ViewChild,
	HostBinding,
	HostListener,
	ElementRef,
	EventEmitter,
	forwardRef,
	SimpleChanges,
	OnChanges
} from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DropdownItemPickerModel, DropdownItemPickerModelValue } from './dropdown-item-picker.model';

import { Observable } from 'rxjs';

const ESCAPE_KEYCODE = 27;
const KEYUP_KEYCODE = 38;
const KEYDONW_KEYCODE = 40;

@Component({
	selector: 'dropdown-item-picker',
	templateUrl: './dropdown-item-picker.html',
	styleUrls: ['./dropdown-item-picker.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DropdownItemPickerComponent),
			multi: true
		}
	]
})

export class DropdownItemPickerComponent implements OnInit, OnChanges, ControlValueAccessor {
	@HostBinding('class.open') open = false;

	@HostListener('click', ['$event'])
	public onClick(e: Event) {
		event.stopPropagation();
		event.preventDefault();

		if((<HTMLInputElement>e.target).name === 'search') {
			return;
		}

		if(this.open) {
			this.configList();
		}
	}

	@HostListener('document:keydown', ['$event'])
	handleKeyboardDownEvent(event: KeyboardEvent) {
		if(!this.open) {
			return;
		}
		switch(event.keyCode) {
			case ESCAPE_KEYCODE:
				this.open = false;
				break;
			case KEYUP_KEYCODE:
				event.stopPropagation();
				event.preventDefault();
				this.up();
				break;
			case KEYDONW_KEYCODE:
				event.stopPropagation();
				event.preventDefault();
				this.down();
				break;
			default:
				break;
		}
	}

	@ViewChild('virtualScrollRef') virtualScroll: CdkVirtualScrollViewport;
	@ViewChild('searchElRef') searchElRef: ElementRef;
	@ViewChild('dropdownItemPickerList') list: ElementRef;

	@Output() paramsChanged = new EventEmitter<DropdownItemPickerModel[]>();

	@Input() data: DropdownItemPickerModel[] = [];
	@Input() dataObservable: Observable<DropdownItemPickerModel[]>;
	@Input() placeholder = '';
	@Input() disabled = false;
	@Input() search = true;
	@Input() withRadioBtn = false;
	@Input() fixedWidth = true;
	@Input() loading = false;
	@Input() defaultValue: DropdownItemPickerModel = {
		name: 'Please choose an option',
		value: null,
		checked: false,
		highlighted: false
	};

	onChange = (value: DropdownItemPickerModelValue|string|number|boolean) => {};
	onTouched = () => {};

	private storeOptions: DropdownItemPickerModel[] = [];

	options: DropdownItemPickerModel[] = [];
	values: DropdownItemPickerModel[] = [];

	highlighted = 0;

	ngOnInit() {
		this.defaultValue.name = this.placeholder || this.defaultValue.name;

		if(this.dataObservable || this.data.length) {
			this.data.length ? this.composeData(this.data) : this.configObservableData();
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if((changes['data'] && !changes['data'].firstChange)) {
			this.composeData(this.data);
		}
	}

	trackByFn(index: number) {
		return index;
	}

	enter() {
		const index = this.getHighlightedElIndex();
		this.chooseOption(this.options[index]);
	}

	toggleOpen() {
		if(this.disabled || this.loading) {
			return;
		}

		this.open = !this.open;
		this.restoreOptions();
		this.configHighlightElements();

		setTimeout(() => {
			this.scrollToIndex(this.options.findIndex(elem => elem.checked));
		});
	}

	chooseOption(option: DropdownItemPickerModel) {
		if(!option) {
			return;
		}
		const isValNotExist = !this.values.filter(e => e.name === option.name && e.value === option.value).length;

		if(isValNotExist) {
			const storeOptions = this.storeOptions.map(e => {
				const isValueObject = typeof option.value === 'object' && option.value !== null;
				// @TODO: Hack for Compare objects. Expect the same ordering in objects
				const isValueEquals = isValueObject ? JSON.stringify(e.value) === JSON.stringify(option.value) : e.value === option.value;
				if(e.name === option.name && isValueEquals) {
					this.setChecked(e, true);
					this.setHighligh(e, true);
				} else {
					this.setChecked(e, false);
					this.setHighligh(e, false);
				}
				return e;
			});

			this.composeData(storeOptions);
			this.paramsChanged.emit(this.values);
		}

		this.open = false;
	}

	searchElement(element: string, event: KeyboardEvent) {
		event.stopPropagation();

		if(event.type === 'submit' || event.keyCode === KEYUP_KEYCODE || event.keyCode === KEYDONW_KEYCODE) {
			event.preventDefault();
			return;
		}

		if(!element) {
			this.restoreOptions();
			return;
		}

		/*
		* new RegExp(terms, "i") - Perform a case-insensitive search
		**/
		const invalid = /[°"§%()\[\]{}=\\?´`'#<>|,;:+]+/g;
		const isSymbolsInvalid = invalid.test(element);
		let isDefaultValue = null;

		this.options = this.storeOptions
			.filter(e => {
				isDefaultValue = e.name === this.placeholder || e.name === this.defaultValue.name;
				if(isSymbolsInvalid || isDefaultValue) {
					return false;
				}
				return !!~e.name.search(new RegExp(element, 'i'));
			});
	}

	removeItems() {
		this.resetValues();
		this.composeData([]);
	}

	reset() {
		this.options.forEach((option, i) => {
			this.setChecked(option, i === 0);
			this.setHighligh(option, i === 0);
		});
		this.resetValues();
	}

	down() {
		const index = this.getHighlightedElIndex();
		if(index === (this.options.length - 1)) {
			return;
		}

		const next = index + 1;
		this.setHighligh(this.options[index], false);
		this.setHighligh(this.options[next], true);
		this.scrollToIndex(index + 1);
	}

	up() {
		const index = this.getHighlightedElIndex();
		if(!index) {
			return;
		}

		const prev = index - 1;
		this.setHighligh(this.options[index], false);
		this.setHighligh(this.options[prev], true);
		this.scrollToIndex(index - 1);
	}

	onMouseOver(i: number) {
		this.options
			.filter(e => e.highlighted)
			.forEach(e => this.setHighligh(e, false));
		this.setHighligh(this.options[i], true);
	}

	private configHighlightElements() {
		this.options
			.map(e => {
				if(e.checked) {
					this.setHighligh(e, true);
				}
				return e;
			})
			.filter(e => !e.checked)
			.forEach(e => {
				this.setHighligh(e, false);
			});
	}

	private resetValues() {
		this.values.splice(0);
		this.values.push(this.defaultValue);
	}

	private restoreOptions() {
		this.unchekStoreOptions();
		this.composeOptions(this.storeOptions);
	}

	private unchekStoreOptions() {
		const options = this.options.filter(e => e.checked);
		this.storeOptions
			.filter(e => {
				return !!options.filter(i => {
					const isValueObject = typeof e.value === 'object' && e.value !== null;
					const isValueEquals = isValueObject ? JSON.stringify(e.value) === JSON.stringify(i.value) : e.value === i.value;
					return i.name !== i.name && isValueEquals;
				}).length;
			})
			.forEach(e => this.setChecked(e, false));
	}

	private composeValues(data: DropdownItemPickerModel[]) {
		const clonedArray = JSON.parse(JSON.stringify(data));
		const values = [...clonedArray];
		this.values = values.map((e, i) => (new DropdownItemPickerModel({...e})));
	}

	private composeOptions(data: DropdownItemPickerModel[]) {
		if(!data) {
			this.options = [];
			return;
		}
		const clonedArray = JSON.parse(JSON.stringify(data));
		const defaultOption = this.getDefaultOption(clonedArray);

		const options = defaultOption ? [defaultOption, ...clonedArray] : [...clonedArray];

		this.options = options.map((e, i) => (new DropdownItemPickerModel({...e, id: i})));
	}

	private setHighligh(option: DropdownItemPickerModel, flag: boolean) {
		if(!option) {
			return;
		}
		option.highlighted = flag;
	}

	private setChecked(option: DropdownItemPickerModel, flag: boolean) {
		if(!option) {
			return;
		}
		option.checked = flag;
	}

	private getHighlightedElIndex() {
		const el = this.options.filter(i => i.highlighted)[0];
		return this.options.indexOf(el);
	}

	private scrollToIndex(index: number) {
		if(!this.virtualScroll && index === -1) {
			return;
		}

		this.virtualScroll.scrollToIndex(index);
		this.virtualScroll.checkViewportSize();
	}

	private configList() {
		if(!this.options.length) {
			return;
		}
		const list = this.list.nativeElement;
		const listChildren = list.children;

		list.scrollTop = 0;

		if(this.searchElRef) {
			this.searchElRef.nativeElement.focus();
		}

		Object.keys(listChildren)
			.filter(key => listChildren[key].classList.contains('active'))
			.forEach(key => {
				list.scrollTop = listChildren[key].offsetTop - 65;
			});
	}

	private configObservableData() {
		this.dataObservable
			.subscribe(
				data => {
					this.composeData(data);
					this.loading = false;
				},
				() => {
					this.loading = false;
					this.disabled = true;
				}
			);
	}

	private changeFormControlValue(value: string|number|boolean) {
		setTimeout(() => { // hack for Change Detection
			this.writeValue(value);
			this.onTouched();
		});
	}

	private getFormControlDefaultValue(data: DropdownItemPickerModel[]) {
		const values = data.filter(e => e.checked);
		let value = null;

		if(values.length) {
			value = values[0].value;
		} else if(data.length) {
			value = data[0].value;
		} else {
			value = null;
		}

		return value !== null && typeof value === 'object' ? value.name : value;
	}

	private getDefaultOption(data: DropdownItemPickerModel[]) {
		if(!this.placeholder || !data.length) {
			return null;
		}

		if(!!data.filter(e => e.name === this.defaultValue.name).length) {
			return;
		}

		if(!data.filter(e => e.checked).length) {
			this.setChecked(this.defaultValue, true);
			this.setHighligh(this.defaultValue, true);
			this.composeValues([this.defaultValue]);
		}

		return this.defaultValue;
	}

	composeData(data: DropdownItemPickerModel[]) {
		const values = data.filter(e => e.checked);

		this.composeValues(values);
		this.composeOptions(data);

		this.storeOptions = [...this.options];

		const formControlDefaultValue = this.getFormControlDefaultValue(data);
		this.changeFormControlValue(formControlDefaultValue);
	}

	registerOnChange(fn: (value: DropdownItemPickerModelValue|string|number|boolean) => void) {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void) {
		this.onTouched = fn;
	}

	writeValue(value: DropdownItemPickerModelValue|string|number|boolean) {
		this.onChange(value);
	}
}
