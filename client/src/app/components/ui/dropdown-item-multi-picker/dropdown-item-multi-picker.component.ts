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
	OnDestroy
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { DropdownItemMultiPickerModel } from './dropdown-item-multi-picker.model';

const ESCAPE_KEYCODE = 27;
const KEYUP_KEYCODE = 38;
const KEYDONW_KEYCODE = 40;
const ENTER_KEYCODE = 13;

@Component({
	selector: 'dropdown-item-multi-picker',
	templateUrl: './dropdown-item-multi-picker.html',
	styleUrls: ['./dropdown-item-multi-picker.scss']
})

export class DropdownItemMultiPickerComponent implements OnInit, OnDestroy {
	@HostBinding('class.open') open = false;

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
			case ENTER_KEYCODE:
				this.enter();
				break;
			default:
				break;
		}
	}

	@ViewChild('dropdownItemMultiPickerList') list: ElementRef;
	@ViewChild('searchElRef') searchElRef: ElementRef;

	@Output() paramsChanged = new EventEmitter<DropdownItemMultiPickerModel[]>();

	@Input() data: DropdownItemMultiPickerModel[] = [];
	@Input() dataObservable: Observable<DropdownItemMultiPickerModel[]>;
	@Input() placeholder = '';
	@Input() placeholderEmpty = '';
	@Input() disabled = false;
	@Input() multiple = false;
	@Input() fixedWidth = false;
	@Input() search = true;

	private sub = new Subscription();

	searchControl = new FormControl();

	storeOptions: DropdownItemMultiPickerModel[] = [];

	options: DropdownItemMultiPickerModel[] = [];
	values: DropdownItemMultiPickerModel[] = [];

	defaultOption: DropdownItemMultiPickerModel = {
		name: 'Select All',
		value: null,
		checked: false
	};

	loading = false;
	checkedAll = false;

	ngOnInit() {
		this.data.length ? this.composeData(this.data) : this.configObservableData();

		if(this.search) {
			const sub = this.searchControl.valueChanges
				.pipe(
					debounceTime(300)
				)
				.subscribe(term => {
					const options = this.searchElement(term);
					this.updateOptions(options);
					this.updateStoredOptions(options);
					this.configHighlightElements();
				});
			this.sub.add(sub);
		}
	}


	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	toggleOpen() {
		this.open = !this.open;
		this.configHighlightElements();

		// @TODO: Temporary Hack for scroll to checked element
		setTimeout(() => {
			const firstCheckedElementIndex = this.options.filter(e => e.checked)[0];
			if(this.search && this.searchElRef) {
				this.searchElRef.nativeElement.focus();
			}
			if(firstCheckedElementIndex) {
				const index = this.options.indexOf(firstCheckedElementIndex);
				this.scrollFromTop(index);
			}
		});
	}

	toggle(option: DropdownItemMultiPickerModel) {
		option.name === this.defaultOption.name ? this.toggleAllOptions(!option.checked) : this.toggleOption(option);

		this.updateOptions(this.options);
		this.updateStoredOptions(this.options);
		this.configHighlightElements();
		this.configValues();
		this.paramsChanged.emit(this.values);
	}

	enter() {
		const option = this.options.filter(e => e.highlighted)[0];
		this.toggle(option);
	}

	reset() {
		this.toggleAllOptions(false);
		this.updateStoredOptions(this.options);
		this.configValues();
		this.paramsChanged.emit(this.values);
	}

	resetToSelectAll() {
		this.toggleAllOptions(true);
		this.updateStoredOptions(this.options);
		this.configValues();
		this.paramsChanged.emit(this.values);
	}

	down() {
		const index = this.getHighlightedElIndex();
		if(index === (this.options.length - 1)) {
			return;
		}
		const next = index + 1;
		this.scrollToItem(next);
		this.setHighligh(this.options[index], false);
		this.setHighligh(this.options[next], true);
	}

	up() {
		const index = this.getHighlightedElIndex();
		if(!index) {
			return;
		}
		const prev = index - 1;
		this.setHighligh(this.options[index], false);
		this.setHighligh(this.options[prev], true);
		this.scrollToItem(prev);
	}

	onMouseOver(index: number) {
		this.options
			.forEach((e, i) => index === i ? this.setHighligh(e, true) : this.setHighligh(e, false));
	}


	private searchElement(element: string) {
		/*
		* new RegExp(terms, "i") - Perform a case-insensitive search
		**/
		const invalid = /[Â°"Â§%()\[\]{}=\\?Â´`'#<>|,;.:+]+/g;
		const isSymbolsInvalid = invalid.test(element);
		const storeOptionsWithoutDefault = this.getOptionsWhitoutDefault(this.storeOptions);

		let storedEl = null;
		return storeOptionsWithoutDefault
			.filter(() => !isSymbolsInvalid)
			.filter(e => !!~e.name.search(new RegExp(element, 'i')))
			.map(el => {
				storedEl = this.options.filter(e => e.name === el.name && e.helpText === el.helpText)[0];
				el.checked = storedEl ? storedEl.checked : el.checked;
				return el;
			});
	}

	private updateOptions(options: DropdownItemMultiPickerModel[]) {
		const optionsWhitoutDefault = this.getOptionsWhitoutDefault(options);

		if(optionsWhitoutDefault.length) {
			this.defaultOption.checked = optionsWhitoutDefault.every(e => e.checked);
			this.options = [this.defaultOption, ...optionsWhitoutDefault];
		} else {
			this.options = [];
		}
	}

	private updateStoredOptions(options: DropdownItemMultiPickerModel[]) {
		let el = null;
		this.storeOptions.forEach(e => {
			el = options.filter(i => i.name === e.name && i.helpText === e.helpText)[0];
			e.checked = el ? el.checked : e.checked;
		});

	}

	private getHighlightedElIndex() {
		const el = this.options.filter(i => i.highlighted)[0];
		return this.options.indexOf(el);
	}

	private configHighlightElements() {
		const optionsWhitoutDefault = this.getOptionsWhitoutDefault(this.options);
		const highlightedElements = optionsWhitoutDefault.filter(e => e.highlighted);

		if(highlightedElements.length) {
			const elementIndex = this.options.indexOf(highlightedElements[0]);
			this.options.forEach((e, i) => this.setHighligh(e, i === elementIndex));
		} else {
			this.options.forEach((e) => this.setHighligh(e, e.name === this.defaultOption.name));
		}
	}

	private setHighligh(option: DropdownItemMultiPickerModel, flag: boolean) {
		if(!option) {
			return;
		}
		option.highlighted = flag;
	}

	private toggleOption(option: DropdownItemMultiPickerModel) {
		option.checked = !option.checked;
	}

	private toggleAllOptions(status: boolean) {
		this.options.forEach(e => e.checked = status);
	}

	private configValues() {
		this.values.splice(0);
		const optionsWhitoutDefault = this.getOptionsWhitoutDefault(this.storeOptions);
		optionsWhitoutDefault
			.filter(e => e.checked)
			.forEach((option) => this.values.push(option));
	}

	private getOptionsWhitoutDefault(options: DropdownItemMultiPickerModel[]) {
		return options.filter((e) => e.name !== this.defaultOption.name);
	}

	private scrollFromTop(pos: number) {
		const data = this.getScrollData(pos);
		if(data.viewPort < data.liTopPosition) {
			this.list.nativeElement.scrollTop = data.liTopPosition - data.liHeight;
		}
	}

	private scrollToItem(pos: number) {
		const data = this.getScrollData(pos);

		if(data.viewPort < data.liPosition) {
			this.list.nativeElement.scrollTop = data.scrollTo;
		}

		if(data.scrollTop > data.liTopPosition) {
			this.list.nativeElement.scrollTop = data.scrollTop - data.liHeight;
		}
	}

	private getScrollData(pos: number) {
		const li = <HTMLElement>this.list.nativeElement.children[pos];

		if(!li) {
			return;
		}

		const scrollTop = this.list.nativeElement.scrollTop;
		const wrapperHeight = this.list.nativeElement.clientHeight;
		const viewPort = scrollTop + wrapperHeight;

		const liTopPosition = li.offsetTop;
		const liHeight = li.clientHeight;
		const liPosition = liTopPosition + liHeight;
		const scrollTo = scrollTop + liHeight;

		return {
			scrollTop,
			viewPort,
			liTopPosition,
			scrollTo,
			liPosition,
			liHeight
		};
	}

	private configObservableData() {
		if(!this.dataObservable) {
			return;
		}
		this.loading = true;
		this.dataObservable.subscribe(data => {
			this.composeData(data);
			this.loading = false;
		});
	}

	private composeValues(list: DropdownItemMultiPickerModel[]) {
		this.values.splice(0);
		this.values.push(...list);
	}

	private composeOptions(list: DropdownItemMultiPickerModel[]) {
		this.options.splice(0);
		this.options.push(...list);
	}

	private composeStoredOptions() {
		this.storeOptions.splice(0);
		this.storeOptions = this.options.map(e => new DropdownItemMultiPickerModel(e));
	}

	private composeData(list: DropdownItemMultiPickerModel[]) {
		const values = list.filter(e => e.checked);
		this.defaultOption.checked = list.every(e => e.checked);
		const options = list.map(e => new DropdownItemMultiPickerModel(e));

		this.composeValues(values);
		this.composeOptions([this.defaultOption, ...options]);
		this.composeStoredOptions();
	}
}
