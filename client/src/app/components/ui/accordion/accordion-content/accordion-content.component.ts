import { Component, Input, ContentChild } from '@angular/core';
import { AccordionContentLazyDirective } from './accordion-content-lazy.directive';

@Component({
	selector: 'accordion-content',
	templateUrl: './accordion-content.html',
	styleUrls: ['./accordion-content.scss']
})
export class AccordionContentComponent {
	@ContentChild(AccordionContentLazyDirective, { static: true }) lazyContent: AccordionContentLazyDirective;
	isOpen = false;

	@Input()
	set open(value: boolean) {
		this.isOpen = !!value;
	}
	get open() {
		return this.isOpen;
	}
}
