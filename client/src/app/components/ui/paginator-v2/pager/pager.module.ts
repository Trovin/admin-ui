import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PaginationModule } from 'ngx-bootstrap/pagination';

import { SharedModule } from '@components/shared/shared.module';

import { PagerV2Service } from './pager.service';
import { PagerComponent } from './pager.component';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,

		PaginationModule.forRoot()
	],
	declarations: [
		PagerComponent
	],
	exports: [
		PagerComponent
	],
	providers: [
		PagerV2Service
	]
})
export class PagerModule {}
