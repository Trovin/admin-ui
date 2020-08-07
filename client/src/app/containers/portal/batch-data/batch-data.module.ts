import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';

import { BatchDataTabsModule } from './tabs/tabs.module';
import { BatchDataMissingEventsModule } from './missing-events/missing-events.module';

import { BatchDataComponent } from './batch-data.component';
import { BatchDataRoutingModule } from './batch-data-routing.module';

@NgModule({
	imports: [
		SharedModule,

		BatchDataTabsModule,
		BatchDataMissingEventsModule,

		BatchDataRoutingModule
	],
	declarations: [
		BatchDataComponent
	],
	exports: [
		BatchDataComponent
	]
})

export class BatchDataModule {}
