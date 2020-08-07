import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@components/shared/shared.module';
import { PermissionsDirectiveModule } from '@core/permissions/directive/permissions-directive.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AutoConfFilesFormComponent } from './form.component';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		ReactiveFormsModule,
		PermissionsDirectiveModule,
		BsDropdownModule.forRoot()
	],
	declarations: [
		AutoConfFilesFormComponent
	],
	exports: [
		AutoConfFilesFormComponent
	]
})

export class AutoConfFilesFormModule {}
