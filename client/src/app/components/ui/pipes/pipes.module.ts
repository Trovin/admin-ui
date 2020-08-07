import { NgModule } from '@angular/core';
import { DatePipe as NgDatePipe, DecimalPipe } from '@angular/common';

import { TitleCasePipe } from './title-case.pipe';
import { DateTimeFormatPipe } from './date-time-format.pipe';
import { DatePipe } from './date.pipe';
import { AbbreviateNumberPipe } from './abbreviate-number.pipe';
import { BytesPipe } from './bytes.pipe';
import { KeysPipe } from './obj-key-array.pipe';
import { TimeFormatPipe } from './time-format.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { SafeHtmlPipe } from './safe-html.pip';
import { FileProcessingStatusPipe } from './file-processing-status.pipe';
import { ReplacePipe } from './replace.pipe';
import { PrettyJsonPipe } from '@components/ui/pipes/pretty-json.pipe';

@NgModule({
	declarations: [
		TitleCasePipe,
		DatePipe,
		BytesPipe,
		TimeFormatPipe,
		KeysPipe,
		DateTimeFormatPipe,
		AbbreviateNumberPipe,
		SafeUrlPipe,
		SafeHtmlPipe,
		FileProcessingStatusPipe,
		ReplacePipe,
		PrettyJsonPipe
	],
	exports: [
		TitleCasePipe,
		DatePipe,
		BytesPipe,
		TimeFormatPipe,
		KeysPipe,
		DateTimeFormatPipe,
		AbbreviateNumberPipe,
		SafeUrlPipe,
		SafeHtmlPipe,
		FileProcessingStatusPipe,
		ReplacePipe,
		PrettyJsonPipe
	],
	providers: [
		NgDatePipe,
		DecimalPipe
	]
})

export class PipesModule {}
