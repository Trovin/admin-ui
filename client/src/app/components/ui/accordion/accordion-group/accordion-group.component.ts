import { Component, ContentChild, Output, EventEmitter } from '@angular/core';
import { AccordionHeaderComponent } from '../accordion-header/accordion-header.component';
import { AccordionContentComponent } from '../accordion-content/accordion-content.component';

@Component({
	selector: 'accordion-group',
	templateUrl: './accordion-group.html',
	styleUrls: ['./accordion-group.scss']
})

export class AccordionGroupComponent {
	@Output() openChanged = new EventEmitter<boolean>();

	@ContentChild(AccordionHeaderComponent, { static: true }) header: AccordionHeaderComponent;
	@ContentChild(AccordionContentComponent, { static: true }) content: AccordionContentComponent;

	toggle() {
		this.header.open = !this.header.open;
		this.content.open = !this.content.open;

		this.openChanged.emit(this.header.open);
	}
}
