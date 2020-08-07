import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorsComponent } from './errors.component';

const routes: Routes = [
	{
		path: 'errors',
		component: ErrorsComponent,
		children: [
			{
				path: 'authentication-error',
				loadChildren: () => import('./authentication/authentication.module').then(m => m.ErrorsAuthenticationModule)
			},
			{
				path: 'server-error',
				loadChildren: () => import('./server/server.module').then(m => m.ErrorsServerModule)
			}
		]
	},
	{
		path: '**',
		loadChildren: () => import('./404/404.module').then(m => m.Errors404Module)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ErrorsRoutingModule {}
