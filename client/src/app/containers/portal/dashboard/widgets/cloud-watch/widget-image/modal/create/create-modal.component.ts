import { Component, Input } from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { alertsService } from '@components/ui';

import { Containers } from '@config/containers.enum';
import { DateRangeType } from '@enums/date-range-type.enum';

import { CloudWatchWidgetImageService, WidgetImageQueriesDto } from '@rest/aws/cloud-watch/widget-image';

import { CloudWatchPersistentStateService } from './../../../shared/persistent-state.service';
import { CloudWatchWidgetImageModel } from './../../widget-image.model';

const CONTAINER = `galaxy-${Containers.DASHBOARD}`;

@Component({
	selector: 'create-modal',
	templateUrl: './create-modal.html',
	styleUrls: ['./create-modal.scss'],
	providers: [
		CloudWatchWidgetImageService,
		CloudWatchPersistentStateService
	]
})
export class CloudWatchWidgetCreateModalComponent {
	@Input() title: string;
	@Input() item: CloudWatchWidgetImageModel;
	@Input() action: ModalActionsEnum;

	form: FormGroup;
	modalActions = ModalActionsEnum;
	confirmed = new Subject<boolean>();

	loading = false;

	constructor(
		public bsModalRef: BsModalRef,
		private cloudWatchWidgetImageService: CloudWatchWidgetImageService,
		private cloudWatchPersistentStateService: CloudWatchPersistentStateService
	) {
		this.createForm();
	}

	ngOnInit() {
		const widgetDefinition = this.item && this.item.widgetDefinition ? JSON.stringify(JSON.parse(this.item.widgetDefinition), undefined, 2) : '';
		this.form.patchValue({widgetDefinition});
	}

	submit() {
		switch(this.action) {
			case ModalActionsEnum.CREATE:
				return this.create();
			case ModalActionsEnum.UPDATE:
				return this.update();
			case ModalActionsEnum.DELETE:
				return this.delete();
			default:
				return false;
		}
	}

	decline() {
		this.confirmed.next(false);
		this.confirmed.complete();
		this.bsModalRef.hide();
	}

	private create() {
		this.loading = true;
		this.cloudWatchWidgetImageService
			.create(new WidgetImageQueriesDto({
				widgetDefinition: this.form.get('widgetDefinition').value,
				createdDate: DateRangeType.getUTCDate(),
				updatedDate: DateRangeType.getUTCDate()
			}))
			.subscribe(
				() => {
					alertsService.success('Widget Successfully Created');
					this.loading = false;
					this.confirmed.next(true);
					this.decline();
				},
				() => this.loading = false
			);
	}

	private update() {
		this.loading = true;

		const value = this.form.get('widgetDefinition').value || '{}';
		const queries = new WidgetImageQueriesDto({
			widgetDefinition: value,
			period: JSON.parse(value).period,
			updatedDate: DateRangeType.getUTCDate()
		});

		this.cloudWatchWidgetImageService
			.update(this.item.uuid, queries)
			.subscribe(
				() => {
					alertsService.success('Widget Successfully Edited');

					const params = this.cloudWatchPersistentStateService.getParams(CONTAINER);
					this.cloudWatchPersistentStateService.setParamsSubj(CONTAINER, {
						[this.item.uuid]: {
							...params[this.item.uuid],
							period: queries.period
						}
					});

					this.loading = false;
					this.confirmed.next(true);
					this.decline();
				},
				() => this.loading = false
			);
	}

	private delete() {
		this.loading = true;
		this.cloudWatchWidgetImageService
			.delete(this.item.uuid)
			.subscribe(
				() => {
					alertsService.success('Widget Successfully Deleted');
					this.loading = false;
					this.decline();
					this.confirmed.next(true);
				},
				() => this.loading = false
			);
	}

	private createForm() {
		this.form = new FormGroup({
			widgetDefinition: new FormControl('', [Validators.required, this.jsonValidator])
		});
	}

	private jsonValidator(control: AbstractControl): ValidationErrors | null {
		try {
			JSON.parse(control.value);
		} catch (e) {
			return { jsonInvalid: true };
		}

		return null;
	}
}
