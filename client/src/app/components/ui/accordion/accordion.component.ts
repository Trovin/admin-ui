import {
	Component,
	ContentChildren,
	QueryList,
	AfterContentInit
} from '@angular/core';

import { switchMap, startWith, mapTo } from 'rxjs/operators';
import { merge } from 'rxjs';

import { AccordionGroupComponent } from './accordion-group/accordion-group.component';

@Component({
	selector: 'accordion',
	templateUrl: './accordion.html',
	styleUrls: ['./accordion.scss']
})

export class AccordionComponent implements AfterContentInit {
	@ContentChildren(AccordionGroupComponent) groups: QueryList<AccordionGroupComponent>;

	ngAfterContentInit() {
		this.groups.changes
			.pipe(
				startWith(this.groups),
				switchMap((groups: QueryList<AccordionGroupComponent>) => {
					return merge(...groups.map(group => group.header.click.pipe(mapTo(group))));
				})
			)
			.subscribe(group => {
				group.toggle();
			});
	}
}
