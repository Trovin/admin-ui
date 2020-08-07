import { NgModule } from '@angular/core';
import { PipesModule } from '@components/ui/pipes';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@components/shared/shared.module';
import { SwitchControlModule } from '@components/ui/switch-control/switch-control.module';
import { TableComponent } from '@containers/portal/user/notification-subscriptions/table/table.component';

@NgModule({
	declarations: [
		TableComponent
	],
	exports: [
		TableComponent
	],
	entryComponents: [
		TableComponent
	],
	imports: [
		SwitchControlModule,
		CommonModule,
		SharedModule,
		PipesModule
	]
})

export class TableModule {
}
