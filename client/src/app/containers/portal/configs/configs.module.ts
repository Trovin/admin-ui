import { NgModule } from '@angular/core';
import { SharedModule } from '@components/shared/shared.module';
import { ConfigsRoutingModule } from './configs-routing.module';
import { ConfigsComponent } from './configs.component';

@NgModule({
	imports: [
		SharedModule,
		ConfigsRoutingModule
	],
	declarations: [
		ConfigsComponent
	],
	exports: [
		ConfigsComponent
	]
})

export class ConfigsModule {}
