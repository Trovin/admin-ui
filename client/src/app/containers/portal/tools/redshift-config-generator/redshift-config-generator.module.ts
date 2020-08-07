import { NgModule } from '@angular/core';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes';

import { ToolsRedshiftConfigGeneratorRoutingModule } from './redshift-config-generator-routing.module';
import { ToolsRedshiftConfigGeneratorComponent } from './redshift-config-generator.component';

@NgModule({
	imports: [
		SharedModule,
		PipesModule,
		PageHeaderModule,

		ToolsRedshiftConfigGeneratorRoutingModule
	],
	declarations: [
		ToolsRedshiftConfigGeneratorComponent
	],
	exports: [
		ToolsRedshiftConfigGeneratorComponent
	]
})

export class ToolsRedshiftConfigGeneratorModule {}
