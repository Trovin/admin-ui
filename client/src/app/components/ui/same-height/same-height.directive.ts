import { Directive, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Directive({
	selector: '[sameHeight]'
})

export class SameHeightDirective implements OnInit {
	@Input() sameHeightElClass = '';

	constructor(
		private el: ElementRef,
		private renderer: Renderer2
	) {}

	ngOnInit() {
		this.init();
	}

	init() {
		const collection: HTMLCollection = this.el.nativeElement.getElementsByClassName(this.sameHeightElClass);
		const maxHeight = [].slice.call(collection).reduce((a, b) => Math.max(a, b.offsetHeight), 0);
		const elements: Element[] = [].slice.call(collection);

		elements.forEach(element => this.renderer.setAttribute(element, 'style', `height:${maxHeight}px`));
	}
}