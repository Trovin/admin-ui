import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';

import { AutoConfTabsModule } from './tabs/tabs.module';

import { PipelinesConfigsComponent } from './pipelines-configs.component';
import { PipelinesConfigsRoutingModule } from './pipelines-configs-routing.module';

@NgModule({
	imports: [
		SharedModule,

		PipelinesConfigsRoutingModule,

		AutoConfTabsModule
	],
	declarations: [
		PipelinesConfigsComponent
	],
	exports: [
		PipelinesConfigsComponent
	]
})

export class PipelinesConfigsModule {}
