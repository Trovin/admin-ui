import { NgModule } from '@angular/core';
import { SharedModule } from '@components/shared/shared.module';
import { ToolsRoutingModule } from './tools-routing.module';
import { ToolsComponent } from './tools.component';

@NgModule({
	imports: [
		SharedModule,
		ToolsRoutingModule
	],
	declarations: [
		ToolsComponent
	],
	exports: [
		ToolsComponent
	]
})

export class ToolsModule {}
