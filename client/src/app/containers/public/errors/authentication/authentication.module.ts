import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@components/shared/shared.module';

import { ErrorsAuthenticationComponent } from './authentication.component';
import { ErrorsAuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
	imports: [
		RouterModule,
		SharedModule,

		ErrorsAuthenticationRoutingModule
	],
	declarations: [
		ErrorsAuthenticationComponent
	],
	exports: [
		ErrorsAuthenticationComponent
	],
	providers: []
})

export class ErrorsAuthenticationModule {}
