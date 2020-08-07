import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TabsModule } from 'ngx-bootstrap/tabs';

import { SharedModule } from '@components/shared/shared.module';

import { DetailsComponent } from './details.component';

@NgModule({
	imports: [
		SharedModule,
		RouterModule,
		TabsModule.forRoot()
	],
	declarations: [
		DetailsComponent
	],
	exports: [
		DetailsComponent
	]
})

export class DetailsModule {}
