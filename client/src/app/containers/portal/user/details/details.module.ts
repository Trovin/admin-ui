import { NgModule } from '@angular/core';

import { AccordionModule } from '@components/ui/accordion/accordion.module';
import { SharedModule } from '@components/shared/shared.module';

import { RequestPermissionModalModule } from './modal/request/request-modal.module';

import { UserDetailsComponent } from './details.component';
import { UserDetailsRoutingModule } from './details-routing.module';

@NgModule({
	imports: [
		SharedModule,
		UserDetailsRoutingModule,
		AccordionModule,
		RequestPermissionModalModule
	],
	declarations: [
		UserDetailsComponent
	],
	exports: [
		UserDetailsComponent
	]
})

export class UserDetailsModule {}
