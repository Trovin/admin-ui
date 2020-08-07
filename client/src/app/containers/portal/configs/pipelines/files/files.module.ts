import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';

import { AutoConfFilesFormModule } from './../form/form.module';
import { AutoConfFilesListModule } from './../list/list.module';

import { AutoConfFilesComponent } from './files.component';

@NgModule({
	imports: [
		SharedModule,
		AutoConfFilesFormModule,
		AutoConfFilesListModule
	],
	declarations: [
		AutoConfFilesComponent
	],
	exports: [
		AutoConfFilesComponent
	]
})

export class AutoConfFilesModule {}
