import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SwitchControlModule } from '@components/ui/switch-control/switch-control.module';
import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes';

import { ModalsModule } from './modal/modals.module';

import { NotificationSubscriptionsRoutingModule } from './notification-subscriptions-routing.module';
import { NotificationSubscriptionsComponent } from './notification-subscriptions.component';
import { TableModule } from '@containers/portal/user/notification-subscriptions/table/table.module';

@NgModule({
	imports: [
		SharedModule,
		RouterModule,
		PipesModule,
		PageHeaderModule,
		SwitchControlModule,
		ModalsModule,

		NotificationSubscriptionsRoutingModule,
		TableModule
	],
	declarations: [
		NotificationSubscriptionsComponent
	],
	exports: [
		NotificationSubscriptionsComponent
	]
})

export class NotificationSubscriptionsModule {}
