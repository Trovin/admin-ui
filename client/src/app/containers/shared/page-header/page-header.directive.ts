import { Directive, TemplateRef, ViewContainerRef, EmbeddedViewRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
	selector: '[ngTemplateRenderer]'
})
export class PageHeaderSubtitleDirective implements OnInit, OnDestroy {
	@Input('ngTemplateRenderer')
	private template: TemplateRef<any>;

	private view: EmbeddedViewRef<any>;

	constructor(private container: ViewContainerRef) {}

	ngOnInit() {
		this.view = this.container.createEmbeddedView(this.template);
	}

	ngOnDestroy() {
		this.view.destroy();
	}
}