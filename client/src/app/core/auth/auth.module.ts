import { NgModule } from '@angular/core';

import { OktaModule } from './okta/okta.module';
import { GuardsModule } from './guards/guards.module';

import { AuthService } from './auth.service';

@NgModule({
	imports: [
		OktaModule,
		GuardsModule
	],
	providers: [
		AuthService
	]
})
export class AuthModule {}
