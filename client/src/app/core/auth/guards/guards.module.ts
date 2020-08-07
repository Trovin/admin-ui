import { NgModule } from '@angular/core';

import { AuthGuard } from './guard.service';
import { PermissionsGuard } from './permissions-guard.service';
import { RedirectGuard } from './redirect-guard.service';

@NgModule({
	imports: [],
	providers: [
		AuthGuard,
		PermissionsGuard,
		RedirectGuard
	]
})
export class GuardsModule {}
