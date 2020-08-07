import {
	Component,
	Input,
	Output,
	OnInit,
	EventEmitter,
	ViewChild
} from '@angular/core';

import { DateRangeColumnType } from '@enums/date-range-column-type.enum';
import { DateRangeType } from '@enums/date-range-type.enum';

import { DateRangeDataModel } from '@components/ui/date-range/date-range.model';
import { MaterialDateRangeComponent } from '@components/ui/date-range/material-date-range/material-date-range.component';
import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';

import { MonitoringRedshiftDdlParamsService } from './../shared/params.service';
import { MonitoringRedshiftDdlParamsModel } from './../shared/params.model';

interface DateRangeColumnTypeModel {
	name: string;
	value: DateRangeColumnType;
	checked: boolean;
}

@Component({
	selector: 'redshift-ddl-form',
	templateUrl: './form.html',
	styleUrls: ['./form.scss']
})

export class MonitoringRedshiftDdlFormComponent implements OnInit {
	@ViewChild(MaterialDateRangeComponent, {static: true}) dateRange: MaterialDateRangeComponent;
	@ViewChild(DropdownItemPickerComponent, {static: true}) dropdownItemPicker: DropdownItemPickerComponent;

	@Output() changed = new EventEmitter<MonitoringRedshiftDdlParamsModel>();

	@Input() loading = false;

	params = new MonitoringRedshiftDdlParamsModel();
	open = false;

	dates = new DateRangeDataModel();
	defaultDateRangeColumnType = {
		name: DateRangeColumnType.getName(DateRangeColumnType.START_TIME),
		value: DateRangeColumnType.START_TIME,
		checked: true,
		highlighted: true
	};
	defaultDates = DateRangeType.getDateRangeData(DateRangeType.TODAY);
	dateRangeColumnTypes: DateRangeColumnTypeModel[] = [];
	exclude = [
		DateRangeType.LAST_3HOURS,
		DateRangeType.LAST_12MONTHS
	];

	constructor(private paramsService: MonitoringRedshiftDdlParamsService) {}

	ngOnInit() {
		this.configParams(this.paramsService.getParams());
		this.configDateRangeColumnTypes();
	}

	close() {
		this.open = false;
	}

	submit() {
		this.changed.emit(this.params);
	}

	reset() {
		this.resetData();
		this.submit();
	}

	refresh() {
		this.changed.emit(this.params);
	}

	changeSearch(val: string) {
		this.params.search = val || null;
	}

	dateRangeColumnTypeChanged(type: DateRangeColumnType) {
		this.params.dateRangeColumnType = type;
	}

	applyDates(dates: DateRangeDataModel) {
		this.params.dateRange = dates.dateRange;
		this.params.dateFrom = dates.dateFrom;
		this.params.dateTo = dates.dateTo;
	}

	private resetData() {
		const params = this.paramsService.getDefaultParams();
		this.configParams(params);
		this.dateRange.reset();
		this.dropdownItemPicker.reset();
	}

	private configDateRangeColumnTypes() {
		this.dateRangeColumnTypes.push(
			{
				name: DateRangeColumnType.getName(DateRangeColumnType.START_TIME),
				value: DateRangeColumnType.START_TIME,
				checked: this.params.dateRangeColumnType === DateRangeColumnType.START_TIME
			},
			{
				name: DateRangeColumnType.getName(DateRangeColumnType.END_TIME),
				value: DateRangeColumnType.END_TIME,
				checked: this.params.dateRangeColumnType === DateRangeColumnType.END_TIME
			}
		);
	}

	private configParams(params?: MonitoringRedshiftDdlParamsModel) {
		this.params.page = params.page;
		this.params.search = params.search;
		this.params.dateRangeColumnType = params.dateRangeColumnType;
		this.params.dateRange = params.dateRange;
		this.params.dateFrom = params.dateFrom;
		this.params.dateTo = params.dateTo;

		this.dates.dateRange = params.dateRange;
		this.dates.dateFrom = params.dateFrom;
		this.dates.dateTo = params.dateTo;
	}
}
