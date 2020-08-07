import { Directive, Input, ElementRef, HostBinding, SimpleChange, OnChanges } from '@angular/core';

@Directive({
	selector: '[collapse]'
})

export class CollapseDirective implements OnChanges {
	@HostBinding('class.collapse') inited = true;
	@HostBinding('class.show') in = false;
	@HostBinding('class.hide') out = true;
	@HostBinding('style.max-height') maxHeight = 'none';
	@Input() collapse = false;

	private defaultHeight = 400;
	private height = 0;

	constructor(private element: ElementRef) {}

	ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
		this.initHeight();
		this.maxHeight = this.height + 'px';

		setTimeout(() => {
			this.in = !changes['collapse'].currentValue;
			this.out = !this.in;
		});

		setTimeout(
			() => {
				this.maxHeight = 'none';
			},
			1000
		);
	}

	private initHeight() {
		const height = this.element.nativeElement.offsetHeight || this.defaultHeight;
		this.height = this.height < height ? height : this.height;
	}
}