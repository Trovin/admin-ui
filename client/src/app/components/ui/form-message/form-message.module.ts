import { NgModule } from '@angular/core';
import { SharedModule } from '@components/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormValidationService } from './form-validation.service';
import { FormMessageComponent } from './form-message.component';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		FormMessageComponent
	],
	exports: [
		FormMessageComponent
	],
	providers: [
		FormValidationService
	]
})

export class FormMessageModule {}