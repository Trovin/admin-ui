import { NgModule } from '@angular/core';
import { SharedModule } from '@components/shared/shared.module';

import { AccordionComponent } from './accordion.component';
import { AccordionGroupComponent } from './accordion-group/accordion-group.component';
import { AccordionHeaderComponent } from './accordion-header/accordion-header.component';
import { AccordionContentComponent } from './accordion-content/accordion-content.component';
import { AccordionContentLazyDirective } from './accordion-content/accordion-content-lazy.directive';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		AccordionComponent,
		AccordionGroupComponent,
		AccordionHeaderComponent,
		AccordionContentComponent,
		AccordionContentLazyDirective
	],
	exports: [
		AccordionComponent,
		AccordionGroupComponent,
		AccordionHeaderComponent,
		AccordionContentComponent,
		AccordionContentLazyDirective
	]
})

export class AccordionModule {}
