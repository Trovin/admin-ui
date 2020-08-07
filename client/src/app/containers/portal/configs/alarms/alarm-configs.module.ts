import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { PipesModule } from '@components/ui/pipes';
import { SharedModule } from '@components/shared/shared.module';

import { AlarmConfigFormModule } from './form/form.module';

import { PaginatorModule } from '@components/ui/paginator/paginator.module';
import { SwitchControlModule } from '@components/ui/switch-control/switch-control.module';

import { ModalsModule } from './modal/modals.module';

import { AlarmConfigRoutingModule } from './alarm-configs.routing.module';
import { AlarmConfigComponent } from './alarm-configs.component';

@NgModule({
	imports: [
		SharedModule,
		RouterModule,
		PipesModule,
		PaginatorModule,
		SwitchControlModule,
		PageHeaderModule,

		ModalsModule,

		AlarmConfigFormModule,

		AlarmConfigRoutingModule
	],
	declarations: [
		AlarmConfigComponent
	],
	exports: [
		AlarmConfigComponent
	]
})

export class AlarmConfigModule {}
