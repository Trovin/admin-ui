import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'errors-404',
	templateUrl: './404.html'
})export class Errors404Component {
	constructor(private router: Router) {}

	navigateTo(uri: string) {
		this.router.navigateByUrl(uri);
	}
}