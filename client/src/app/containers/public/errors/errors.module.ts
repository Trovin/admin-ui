import { NgModule, ErrorHandler } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';

import { HttpErrorsService } from '@core/http/http-errors.service';

import { ErrorsHandler } from './shared/errors-handler';

import { ErrorsRoutingModule } from './errors-routing.module';
import { ErrorsComponent } from './errors.component';

@NgModule({
	imports: [
		SharedModule,

		ErrorsRoutingModule
	],
	declarations: [
		ErrorsComponent
	],
	exports: [
		ErrorsComponent
	],
	providers: [
		HttpErrorsService,
		{
			provide: ErrorHandler,
			useClass: ErrorsHandler
		}
	]
})
export class ErrorsModule {}