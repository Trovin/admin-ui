import { Directive, ViewContainerRef, TemplateRef } from '@angular/core';

@Directive({
	selector: '[accordionContentLazy]'
})
export class AccordionContentLazyDirective {
	constructor(public content: TemplateRef<any>, public viewContainerRef: ViewContainerRef) {}
}
