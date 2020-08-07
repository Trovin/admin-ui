import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { PipesModule } from '@components/ui/pipes';
import { SharedModule } from '@components/shared/shared.module';
import { PaginatorModule } from '@components/ui/paginator/paginator.module';

import { MonitoringPostProcessingErrorsParamsService } from './shared/params.service';

import { MonitoringPostProcessingErrorsFormModule } from './form/form.module';

import { MonitoringPostProcessingErrorsComponent } from './errors.component';
import { MonitoringPostProcessingErrorsRoutingModule } from './errors-routing.module';

@NgModule({
	imports: [
		SharedModule,
		RouterModule,
		PipesModule,
		PaginatorModule,
		PageHeaderModule,

		MonitoringPostProcessingErrorsFormModule,

		MonitoringPostProcessingErrorsRoutingModule
	],
	declarations: [
		MonitoringPostProcessingErrorsComponent
	],
	exports: [
		MonitoringPostProcessingErrorsComponent
	],
	providers: [
		MonitoringPostProcessingErrorsParamsService
	]
})

export class MonitoringPostProcessingErrorsModule {}
