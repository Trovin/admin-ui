import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserDetailsComponent } from './details.component';

export const routes: Routes = [
	{
		path: 'details',
		component: UserDetailsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class UserDetailsRoutingModule {}
