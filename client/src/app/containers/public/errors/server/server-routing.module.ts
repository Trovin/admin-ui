import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorsServerComponent } from './server.component';

const routes: Routes = [
	{
		path: '',
		component: ErrorsServerComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ErrorsServerRoutingModule {}
