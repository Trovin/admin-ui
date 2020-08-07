import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PaginationModule } from 'ngx-bootstrap/pagination';

import { SharedModule } from '@components/shared/shared.module';

import { PaginatorComponent } from './paginator.component';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,

		PaginationModule.forRoot()
	],
	declarations: [
		PaginatorComponent
	],
	exports: [
		PaginatorComponent
	]
})
export class PaginatorModule {}
