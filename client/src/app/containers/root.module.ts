import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { HttpErrorsInterceptor } from '@core/http/interceptors/errors.interceptor';
import { HttpJwtInterceptor } from '@core/http/interceptors/jwt.interceptor';
import { HttpCancelService } from '@core/http/http-cancel.service';

import { HttpRestService } from '@core/http/http.service';
import { AuthModule } from '@core/auth/auth.module';
import { UserModule } from '@core/user/user.module';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { RouterParamsService } from '@core/router/params.service';
import { LocalStorageService } from '@core/localstorage/localstorage.service';

import { PortalModule } from './portal/portal.module';
import { PublicModule } from './public/public.module';
import { ErrorsModule } from './public/errors/errors.module';
import { NoPermissionsComponent } from './public/no-permissions/no-permissions.component';

import { RootComponent } from './root.component';
import { RootRoutingModule } from './root-routing.module';

@NgModule({
	imports: [
		BrowserModule,
		RootRoutingModule,
		HttpClientModule,
		NoopAnimationsModule,

		PortalModule,
		PublicModule,
		ErrorsModule,

		AuthModule,
		UserModule,
		PermissionsModule
	],
	providers: [
		HttpRestService,
		HttpCancelService,
		RouterParamsService,
		LocalStorageService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpErrorsInterceptor,
			multi: true
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpJwtInterceptor,
			multi: true
		}
	],
	declarations: [
		RootComponent,
		NoPermissionsComponent
	],
	bootstrap: [RootComponent]
})
export class RootModule { }
