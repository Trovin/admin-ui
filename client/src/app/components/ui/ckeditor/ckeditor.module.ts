import { NgModule } from '@angular/core';
import { SharedModule } from '@components/shared/shared.module';

import { CkEditorDirective } from './ckeditor.directive';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		CkEditorDirective
	],
	exports: [
		CkEditorDirective
	]
})

export class CkEditorModule {}