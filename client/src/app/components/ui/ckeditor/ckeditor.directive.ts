import { Directive, Input, ElementRef, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Directive({
	selector: '[ckEditor]'
})

export class CkEditorDirective implements AfterViewInit, OnDestroy {
	@Input() ckEditor: FormControl;
	@Input() observer: Observable<any>;
	@Input() updateData: Observable<string>;

	private el: HTMLInputElement;
	private CKEDITOR = window['CKEDITOR'];

	private editor: any;

	constructor(private elementRef: ElementRef, private zone: NgZone) {
		this.el = elementRef.nativeElement;
	}

	ngAfterViewInit() {
		if(this.updateData) {
			this.updateData.subscribe(() => {
				this.updateView();
			});
		}
		if(!this.observer) {
			return this.init();
		}
		this.observer.subscribe(() => {
			this.init();
		});
	}

	ngOnDestroy() {
		if(!this.editor) {
			return;
		}
		this.editor.removeAllListeners();
		this.editor.destroy(true);
	}

	private init() {
		if(!this.CKEDITOR) {
			return;
		}

		this.editor = this.CKEDITOR.replace(this.el, {
			language: 'en',
			removeButtons: 'Paste,About'
		});

		this.editor.on('change', (evt: any) => {
			const content = evt.editor.getData();
			this.ckEditor.patchValue(content);
			this.markAsTouched();
		});

		this.editor.on('blur', () => {
			this.markAsTouched();
		});
	}

	private updateView() {
		const value = this.ckEditor.value || '';
		this.editor.setData(value, () => {
			this.markAsUnTouched();
		});
	}

	private markAsTouched() {
		this.zone.run(() => {
			this.ckEditor.markAsTouched();
		});
	}

	private markAsUnTouched() {
		this.zone.run(() => {
			this.ckEditor.markAsUntouched();
		});
	}
}