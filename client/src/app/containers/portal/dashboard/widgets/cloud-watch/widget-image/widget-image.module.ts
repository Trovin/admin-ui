import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes';

import { CloudWatchWidgetControlModalModule } from './modal/create/create-modal.module';

import { CloudWatchWidgetFormModule } from './../shared/form/form.module';
import { CloudWatchPersistentStateService } from './../shared/persistent-state.service';

import { CloudWatchWidgetImageComponent } from './widget-image.component';

@NgModule({
	imports: [
		RouterModule,
		SharedModule,
		PipesModule,

		CloudWatchWidgetFormModule,

		CloudWatchWidgetControlModalModule
	],
	declarations: [
		CloudWatchWidgetImageComponent
	],
	exports: [
		CloudWatchWidgetImageComponent
	],
	providers: [
		CloudWatchPersistentStateService
	]
})

export class CloudWatchWidgeImageModule {}
