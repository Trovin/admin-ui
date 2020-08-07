import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { SharedModule } from '@components/shared/shared.module';

import { NavigationComponent } from './nav.component';

@NgModule({
	imports: [
		SharedModule,
		RouterModule,

		BsDropdownModule.forRoot()
	],
	declarations: [
		NavigationComponent
	],
	exports: [
		NavigationComponent
	]
})

export class NavigationModule {}
