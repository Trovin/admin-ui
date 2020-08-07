import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@components/shared/shared.module';

import { PipelineInfoProcessComponent } from './process.component';

@NgModule({
	imports: [
		FormsModule,
		RouterModule,
		SharedModule
	],
	declarations: [
		PipelineInfoProcessComponent
	],
	exports: [
		PipelineInfoProcessComponent
	],
	providers: []
})

export class PipelineInfoProcessModule {}
