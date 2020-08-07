import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicComponent } from './public.component';

export const routes: Routes = [
	{
		path: 'public',
		component: PublicComponent,
		children: [
			{
				path: '',
				loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class PublicRoutingModule {}
