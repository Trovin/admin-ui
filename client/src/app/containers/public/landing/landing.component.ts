import { Component } from '@angular/core';

@Component({
	selector: 'landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.scss']
})
export class LandingComponent {
	date = new Date();
}
