import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { NotificationSubscriptionsComponent } from './notification-subscriptions.component';

export const routes: Routes = [
	{
		path: 'notification-subscriptions',
		component: NotificationSubscriptionsComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.SUBSCRIPTIONS)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class NotificationSubscriptionsRoutingModule {}
