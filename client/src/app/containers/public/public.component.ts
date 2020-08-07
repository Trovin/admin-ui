import { Component } from '@angular/core';

import { IIndexUIPageInfo, IIndexPageInfo } from './../root.interface';

@Component({
	selector: 'public',
	templateUrl: './public.html',
	styleUrls: ['./public.scss']
})

export class PublicComponent implements IIndexUIPageInfo {
	pageInfo: IIndexPageInfo;

	setPageInfo() {}
}
