import { NgModule } from '@angular/core';

import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';

import { oktaConfig } from './okta.config';
import { OktaCallbackGuardService } from './okta-callback-guard.service';

@NgModule({
	imports: [
		OktaAuthModule
	],
	providers: [
		{ provide: OKTA_CONFIG, useValue: oktaConfig },
		OktaCallbackGuardService
	]
})
export class OktaModule {}
