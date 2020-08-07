import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@components/shared/shared.module';
import { AlertsModule } from '@components/ui/alerts/alerts.module';

import { HeaderModule } from './header/header.module';
import { SidebarModule } from './sidebar/sidebar.module';

import { PortalComponent } from './portal.component';
import { PortalRoutingModule } from './portal-routing.module';

@NgModule({
	imports: [
		RouterModule,
		SharedModule,
		AlertsModule,

		SidebarModule,
		HeaderModule,

		PortalRoutingModule
	],
	declarations: [
		PortalComponent
	],
	exports: [
		PortalComponent
	]
})

export class PortalModule {}
