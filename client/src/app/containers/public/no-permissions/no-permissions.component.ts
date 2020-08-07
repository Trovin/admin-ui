import { Component } from '@angular/core';
import { LocationStrategy } from '@angular/common';

@Component({
	selector: 'no-permissions',
	templateUrl: './no-permissions.component.html'
})
export class NoPermissionsComponent {
	constructor(private location: LocationStrategy) {}

	back() {
		this.location.back();
		return false;
	}
}
