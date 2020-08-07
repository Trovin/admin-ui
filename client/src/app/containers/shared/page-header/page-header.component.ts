import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild, ElementRef } from '@angular/core';

@Component({
	selector: 'page-header',
	templateUrl: './page-header.html'
})

export class PageHeaderComponent {
	@ContentChild('pageHeaderSubTitle', { static: true }) pageHeaderSubTitleTpl: TemplateRef<ElementRef>;
	@ContentChild('pageHeaderContent', { static: true }) pageHeaderContentTpl: TemplateRef<ElementRef>;

	@Input() layoutTemplate: TemplateRef<any>;

	@Output() refreshed = new EventEmitter<void>();

	@Input() title = '';
	@Input() linkToWiki = '';
	@Input() isShowRefreshBtn = false;
	@Input()
	set setLoadingStatus(status: boolean) {
		this.loading = status;
	}

	loading = false;

	refresh() {
		this.refreshed.emit();
	}
}
