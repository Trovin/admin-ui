import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { SharedModule } from '@components/shared/shared.module';

import { PageHeaderComponent } from './page-header.component';
import { PageHeaderSubtitleDirective } from './page-header.directive';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		TooltipModule.forRoot()
	],
	declarations: [
		PageHeaderComponent,
		PageHeaderSubtitleDirective
	],
	exports: [
		PageHeaderComponent,
		PageHeaderSubtitleDirective
	]
})

export class PageHeaderModule {}
