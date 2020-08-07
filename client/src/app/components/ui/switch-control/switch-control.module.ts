import { NgModule } from '@angular/core';
import { SharedModule } from '@components/shared/shared.module';

import { SwitchControlComponent } from './switch-control.component';
import { FormsModule } from '@angular/forms';

@NgModule({
	imports: [
		SharedModule,
		FormsModule
	],
	declarations: [
		SwitchControlComponent
	],
	exports: [
		SwitchControlComponent
	]
})

export class SwitchControlModule {}
