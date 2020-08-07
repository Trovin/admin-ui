import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@components/shared/shared.module';

import { HeaderComponent } from './header.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
	imports: [
		RouterModule,
		SharedModule,

		BsDropdownModule.forRoot()
	],
	declarations: [
		HeaderComponent
	],
	exports: [
		HeaderComponent
	]
})

export class HeaderModule {}
