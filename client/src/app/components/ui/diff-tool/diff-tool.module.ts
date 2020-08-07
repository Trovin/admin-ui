import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';

import { PipesModule } from './../pipes/pipes.module';

import { DiffToolComponent } from './diff-tool.component';

@NgModule({
	imports: [
		SharedModule,
		PipesModule
	],
	declarations: [
		DiffToolComponent
	],
	exports: [
		DiffToolComponent
	]
})

export class DiffToolModule {}