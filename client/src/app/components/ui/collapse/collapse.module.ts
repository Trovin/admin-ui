import { NgModule } from '@angular/core';
import { SharedModule } from '@components/shared/shared.module';

import { CollapseDirective } from './collapse.directive';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		CollapseDirective
	],
	exports: [
		CollapseDirective
	]
})

export class CollapseModule {}