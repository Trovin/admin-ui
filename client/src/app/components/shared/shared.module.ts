import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionsDirectiveModule } from '@core/permissions/directive/permissions-directive.module';

@NgModule({
	imports: [
		CommonModule,
		PermissionsDirectiveModule
	],
	exports: [
		CommonModule,
		PermissionsDirectiveModule
	]
})

export class SharedModule {}
