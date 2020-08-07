import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { PermissionsDirectiveModule } from '@core/permissions/directive/permissions-directive.module';
import { ListItemActionsComponent } from './list-item-actions.component';
import { ModalsModule } from './../../modal/modals.module';

@NgModule({
	imports: [
		ModalsModule,
		PermissionsDirectiveModule,
		BsDropdownModule.forRoot()
	],
	declarations: [
		ListItemActionsComponent
	],
	exports: [
		ListItemActionsComponent
	],
	providers: []
})

export class ListItemActionsModule {}
