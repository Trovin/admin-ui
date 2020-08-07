
import { NgModule } from '@angular/core';

import { SameHeightDirective } from './same-height.directive';

@NgModule({
	declarations: [
		SameHeightDirective
	],
	exports: [
		SameHeightDirective
	]
})

export class SameHeightModule {}