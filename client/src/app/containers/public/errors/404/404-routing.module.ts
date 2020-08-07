import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Errors404Component } from './404.component';

const routes: Routes = [
	{
		path: '',
		component: Errors404Component
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class Errors404RoutingModule {}
