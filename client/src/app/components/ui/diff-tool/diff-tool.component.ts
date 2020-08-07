import { Component, Input, SimpleChanges, OnChanges, ViewChildren, QueryList, HostBinding, ElementRef, ViewEncapsulation } from '@angular/core';

import * as Papa from 'papaparse';

import HtmlDiff from 'htmldiff-js';

@Component({
	selector: 'diff-tool',
	templateUrl: './diff-tool.html',
	styleUrls: ['./diff-tool.scss'],
	encapsulation: ViewEncapsulation.None
})

export class DiffToolComponent implements OnChanges {
	@ViewChildren('itemsRef') itemsRef: QueryList<ElementRef>;

	@Input() originalText = '';
	@Input() secondaryText = '';
	@Input() originalTitle = '';
	@Input() secondaryTitle = '';
	@Input() diffTitle = '';

	originalItems = [];
	secondaryItems = [];
	htmlValue = '';

	ngAfterViewInit() {
		this.itemsRef.changes.subscribe(t => {
			if(this.originalItems.length && this.secondaryItems.length) {
				const oldTableHtml = document.getElementById('oldTableHtml');
				const newTableHtml = document.getElementById('newTableHtml');

				setTimeout(() => {
					this.htmlValue = HtmlDiff.execute(oldTableHtml.innerHTML, newTableHtml.innerHTML);
				});
			}
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		if((changes['originalText'] && !changes['originalText'].firstChange) || (changes['secondaryText'] && !changes['secondaryText'].firstChange)) {
			if(this.originalText) {
				this.originalItems = Papa.parse(this.originalText).data;
			}

			if(this.secondaryText) {
				this.secondaryItems = Papa.parse(this.secondaryText).data;
			}
		}
	}
}