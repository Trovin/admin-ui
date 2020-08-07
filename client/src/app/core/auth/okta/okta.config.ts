import { OktaConfig } from '@okta/okta-angular/dist/okta/models/okta.config';

import { environment } from '@environments/environment';

export const oktaConfig: OktaConfig = {
	issuer: environment.okta_issuer,
	redirectUri: environment.okta_redirectUri,
	clientId: environment.okta_clientId,
	scope: 'openid email phone address profile'
};