import {
	Component,
	ElementRef,
	Input,
	HostBinding,
} from '@angular/core';

import { fromEvent } from 'rxjs';

@Component({
	selector: 'accordion-header',
	templateUrl: './accordion-header.html',
	styleUrls: ['./accordion-header.scss']
})
export class AccordionHeaderComponent {
	click = fromEvent(this.host.nativeElement, 'click');
	isOpen = false;

	@Input()
	@HostBinding('class.open')
	set open(value: boolean) {
		this.isOpen = !!value;
	}
	get open() {
		return this.isOpen;
	}

	constructor(private host: ElementRef) {}
}
