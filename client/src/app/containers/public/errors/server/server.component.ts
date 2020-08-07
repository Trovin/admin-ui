import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ErrorParamsModel, ErrorDataModel } from '@core/http/http-errors.service';

@Component({
	selector: 'errors-server',
	templateUrl: './server.html'
})
export class ErrorsServerComponent implements OnInit {
	routeParams: ErrorParamsModel = {};
	data: ErrorDataModel = {};

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit() {
		this.routeParams = new ErrorParamsModel(this.activatedRoute.snapshot.queryParams);
		this.data = new ErrorDataModel(this.activatedRoute.snapshot.data);
	}

	navigateTo(uri: string) {
		this.router.navigateByUrl(uri);
	}

	setPageInfo() {}
}