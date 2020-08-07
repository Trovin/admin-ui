import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';


import { DidixOperationsMaintainArticleComponent } from './maintain-article.component';
import { DidixOperationsMaintainArticleRoutingModule } from './maintain-article-routing.module';

@NgModule({
	imports: [
		SharedModule,

		DidixOperationsMaintainArticleRoutingModule
	],
	declarations: [
		DidixOperationsMaintainArticleComponent
	],
	exports: [
		DidixOperationsMaintainArticleComponent
	]
})

export class DidixOperationsMaintainArticleModule {}
