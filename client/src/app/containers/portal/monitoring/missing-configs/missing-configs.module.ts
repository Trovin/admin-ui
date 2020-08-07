import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes/pipes.module';

import { MonitoringMissingConfigsComponent } from './missing-configs.component';
import { MonitoringMissingConfigsRoutingModule } from './missing-configs-routing.module';
import { ConfirmationModalModule } from '@components/ui/modal-v2/confirmation/confirmation-modal.module';

@NgModule({
	imports: [
		SharedModule,
		RouterModule,
		PipesModule,
		TooltipModule,

		PageHeaderModule,
		ConfirmationModalModule,

		MonitoringMissingConfigsRoutingModule
	],
	declarations: [
		MonitoringMissingConfigsComponent
	],
	exports: [
		MonitoringMissingConfigsComponent
	]
})

export class MonitoringMissingConfigsModule {}
