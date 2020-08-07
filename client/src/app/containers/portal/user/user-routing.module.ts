import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';

export const routes: Routes = [
	{
		path: 'user',
		component: UserComponent
	},
	{
		path: '',
		loadChildren: () => import('./details/details.module').then(m => m.UserDetailsModule)
	},
	{
		path: '',
		loadChildren: () => import('./notification-subscriptions/notification-subscriptions.module').then(m => m.NotificationSubscriptionsModule)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class UserRoutingModule {}
