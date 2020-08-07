import {
	Component,
	OnInit,
	ViewChild,
	OnDestroy,
	HostListener
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';
import { alertsService } from '@components/ui';

import { NotificationSubscriptionsService, NotificationSubscriptionCreateQueriesDto } from '@rest/notification-subscriptions';
import { SourceApplicationsService } from '@rest/source-applications';
import { EventTypesService, EventTypesQueriesDto } from '@rest/event-types';

import { IModalCreateData } from './../modals.service';

@Component({
	selector: 'action-modal',
	templateUrl: './action-modal.html',
	providers: [
		EventTypesService,
		SourceApplicationsService,
		NotificationSubscriptionsService
	]
})

export class ActionModalComponent implements OnInit, OnDestroy {
	@ViewChild('bucketList', {static: true}) bucketList: DropdownItemPickerComponent;
	@HostListener('document:mousedown', ['$event'])
	onDocumentMouseDown(event) {
		if(event.target.nodeName === 'MODAL-CONTAINER') {
			this.bsModalRef.hide();
		}
	}

	private sub = new Subscription();

	form: FormGroup;
	levelListDropdown: DropdownItemPickerModel[] = [];
	textControlBtn: string;
	title: string;

	data: IModalCreateData;

	submitted = false;

	createSubj = new Subject();

	validationError = '';

	level = [
		new DropdownItemPickerModel({name: 'ANY', value: 'ANY', checked: true}),
		new DropdownItemPickerModel({name: 'INFO', value: 'INFO', checked: false}),
		new DropdownItemPickerModel({name: 'WARN', value: 'WARN', checked: false}),
		new DropdownItemPickerModel({name: 'ERROR', value: 'ERROR', checked: false})
	];

	eventIds: DropdownItemPickerModel[] = this.addFirstElement([]);
	eventIdsLoading = false;

	componentsSubj = new Subject<DropdownItemPickerModel[]>();
	sourceAppsSubj = new Subject<DropdownItemPickerModel[]>();
	eventIdsSubj = new Subject<DropdownItemPickerModel[]>();

	constructor(
		public bsModalRef: BsModalRef,
		private formBuilder: FormBuilder,
		private service: NotificationSubscriptionsService,
		private sourceAppsService: SourceApplicationsService,
		private eventTypesService: EventTypesService
	) {}

	ngOnInit() {
		this.createForm();
		this.initComponents();
		this.initSourceApps();
		this.initLevels();
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	submit() {
		this.submitted = true;

		this.setValidationError('');

		if(this.form.invalid) {
			this.form.markAllAsTouched();
			this.submitted = false;
			return;
		}

		const queries = new NotificationSubscriptionCreateQueriesDto(this.form.getRawValue());
		this.service
			.create(queries)
			.subscribe(
				() => {
					alertsService.success('Successfully created');
					this.createSubj.next();
					this.createSubj.complete();
					this.bsModalRef.hide();
					this.submitted = false;
				},
				(err) => {
					this.setValidationError(err.error.message);
					this.submitted = false;
				}
			);
	}

	cancel() {
		this.bsModalRef.hide();
	}

	getForm() {
		return this.form.controls;
	}

	sourceChanged(data: DropdownItemPickerModel[]) {
		this.initEventIds(data[0]);
	}

	private setValidationError(message: string) {
		this.validationError = message;
	}

	private initComponents() {
		this.service
			.getComponents()
			.pipe(
				map(e => e.map(e => (new DropdownItemPickerModel({name: e.name, value: e.alias, checked: false}))))
			)
			.subscribe(
				data => {
					this.componentsSubj.next(this.addFirstElement(this.composeList(data)));
					this.componentsSubj.complete();
				},
				() => {
					this.componentsSubj.error(null);
				}
			);
	}

	private initEventIds(data: DropdownItemPickerModel) {
		this.eventIdsLoading = true;
		const queries = new EventTypesQueriesDto({sourceApplication: data.name });
		this.eventTypesService
			.getList('redshift-data-copy', queries)
			.pipe(
				map(e => e.map(e => ({name: e.eventId})))
			)
			.subscribe(
				data => {
					this.eventIds = this.addFirstElement(this.composeList(data));
					this.eventIdsLoading = false;
				},
				() => this.eventIdsLoading = false
			);
	}

	private initSourceApps() {
		this.sourceAppsService
			.getList('redshift-data-copy')
			.pipe(
				map(e => e.map(e => ({name: e.sourceApplication})))
			)
			.subscribe(
				data => {
					this.sourceAppsSubj.next(this.addFirstElement(this.composeList(data)));
					this.sourceAppsSubj.complete();
				},
				() => {
					this.sourceAppsSubj.error(null);
				}
			);
	}

	private initLevels() {
		this.levelListDropdown = this.composeList(this.level);
	}

	private createForm() {
		this.form = this.formBuilder.group({
			email: [{ value: this.data.userEmail, disabled: !!this.data.userEmail }, [Validators.required, Validators.email]],
			creatorEmail: [this.data.creatorEmail, Validators.required],
			component: ['', Validators.required],
			sourceApplication: ['', Validators.required],
			eventId: ['', Validators.required],
			level: ['', Validators.required],
			exception: [false]
		});
	}

	private composeList(list: DropdownItemPickerModel[]) {
		return list
			.reduce((resultArray, nextElement, i) => {
				const item = resultArray.find(group => group.name === nextElement.name);
				if(!item || i === 0) {
					resultArray.push(nextElement);
				}
				return resultArray;
			}, [])
			.map((e, i) => {
				return {
					name: e.name,
					value: e.value || e.name,
					checked: i === 0
				};
			});
	}

	private addFirstElement(list: DropdownItemPickerModel[]) {
		const firstElement = new DropdownItemPickerModel({
			name: 'All',
			value: '*',
			checked: true
		});

		list.forEach(value => value.checked = false);

		return [firstElement].concat(list);
	}
}
