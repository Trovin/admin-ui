import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OktaCallbackComponent } from '@okta/okta-angular';

import { RedirectGuard } from '@core/auth/guards/redirect-guard.service';
import { OktaCallbackGuardService } from '@core/auth/okta/okta-callback-guard.service';
import { NoPermissionsComponent } from './public/no-permissions/no-permissions.component';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		children: [],
		canActivate: [RedirectGuard]
	},
	{
		path: 'no-permissions',
		component: NoPermissionsComponent
	},
	{
		path: 'implicit/callback',
		component: OktaCallbackComponent,
		canActivate: [OktaCallbackGuardService]
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			useHash: false,
			paramsInheritanceStrategy: 'always',
			enableTracing: false
		})
	],
	exports: [RouterModule]
})

export class RootRoutingModule {}
