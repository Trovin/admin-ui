import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

import { Subscription } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { DropdownItemMultiPickerComponent } from '@components/ui/dropdown-item-multi-picker/dropdown-item-multi-picker.component';
import { DropdownItemMultiPickerModel } from '@components/ui/dropdown-item-multi-picker/dropdown-item-multi-picker.model';

import { AWSSendEmailQueriesDto, AWSSendEmailService } from '@rest/aws/send-email';

import { PermissionAction } from '@enums/permission-actions.enum';
import { PermissionsEffect } from '@enums/permission-effects.enum';

interface PermissionType {
	name: string;
	exist: boolean;
	allow?: boolean;
	deny?: boolean;
}

interface ResourceType {
	resource: string;
	permissions: PermissionType[];
	description: string;
}

interface RequestItemType {
	resources: string[];
	permissions: string[];
}

interface IModalData {
	resources: ResourceType[];
	userEmail: string;
	userName: string;
}

@Component({
	selector: 'request-modal',
	templateUrl: './request-modal.html',
	styleUrls: ['./request-modal.scss'],
	providers: [
		AWSSendEmailService
	]
})

export class RequestPermissionComponent implements OnInit, OnDestroy {
	@ViewChild('resources') resourcesDropdown: DropdownItemMultiPickerComponent;
	@Input() resources: ResourceType[] = [];
	@Input() userEmail = '';
	@Input() userName = '';

	private sub = new Subscription();

	permissions: PermissionType[] = [];
	resourcesDropdownList: DropdownItemMultiPickerModel[] = [];
	requestedResources: RequestItemType[] = [];
	requestErrorMsg = '';
	userNotes = '';
	formGroup: FormGroup;

	permissionAction = PermissionAction;
	permissionsEffect = PermissionsEffect;

	loading = false;
	isEmptyData = false;
	isRequestSent = false;

	constructor(
		public bsModalRef: BsModalRef,
		private service: AWSSendEmailService,
		private formBuilder: FormBuilder
	) {}

	ngOnInit() {
		this.permissions = Object.values(this.permissionAction)
			.filter(item => item !== this.permissionAction.ALL)
			.map(item => {
				return {
					name: item,
					exist: false
				} as PermissionType;
			});

		this.formGroup = this.formBuilder.group({
			resources: [[], Validators.required]
		});

		this.formGroup.addControl('permissions', this.composePermissionsFormGroup(this.permissions));
		this.composeResourceList();
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	get form() {
		return this.formGroup && this.formGroup.controls;
	}

	get permissionsFormGroup(): FormGroup {
		return this.form && <FormGroup>this.form.permissions;
	}

	get selectedPermissions(): string[] {
		let list: string[] = [];

		for (const key in this.permissionsFormGroup.controls) {
			if (this.permissionsFormGroup.controls[key].value) {
				list.push(key);
			} else {
				list = list.filter(id => id !== key);
			}
		}

		return list;
	}

	changedResources(resources: DropdownItemMultiPickerModel[]) {
		this.formGroup.patchValue({resources: resources.length ? resources.map(source => source.name) : null});
	}

	deleteRequestedResource(index: number) {
		this.requestedResources =  this.requestedResources.slice(0, index).concat(this.requestedResources.slice(index + 1, this.requestedResources.length));
	}

	onSubmit() {
		if(this.formGroup.invalid) {
			return;
		}

		const selectedPermissions = this.selectedPermissions;
		const selectedResources = this.formGroup.controls['resources'].value;
		const requestItem = {
			resources: selectedResources,
			permissions: selectedPermissions
		} as RequestItemType;

		this.requestedResources.push(requestItem);
		this.resourcesDropdown.reset();
		this.formGroup.reset();
		this.isEmptyData = false;
	}

	sendRequest() {
		if(!this.requestedResources.length) {
			this.isEmptyData = true;
			return;
		}

		const requestQueries = new AWSSendEmailQueriesDto({
			data: this.requestedResources,
			notes: this.userNotes,
			userEmail: this.userEmail,
			userName: this.userName
		});

		this.loading = true;
		const sub = this.service
			.sendData(requestQueries)
			.subscribe(
				r => {
					this.loading = false;
					this.isRequestSent = true;
				},
				e => {
					this.isRequestSent = true;
					this.requestErrorMsg = e.error.message;
					this.loading = false;
				}
			);

		this.sub.add(sub);
	}

	private checkboxCheckedValidator(minRequired = 1): ValidatorFn {
		return function validate(formGroup: FormGroup) {
			let checked = 0;

			Object.keys(formGroup.controls).forEach(key => {
				const control = formGroup.controls[key];
				if (control.value === true) {
					checked++;
				}
			});

			if (checked < minRequired) {
				return {
					requireCheckboxToBeChecked: true
				};
			}

			return null;
		};
	}

	private composePermissionsFormGroup(permissions: PermissionType[], selectedPermissionsNames: string[] = []): FormGroup {
		const group = this.formBuilder.group({}, {
			validators: this.checkboxCheckedValidator()
		});

		permissions.forEach(permission => {
			const isSelected = selectedPermissionsNames.some(name => name === permission.name);
			group.addControl(permission.name, this.formBuilder.control(isSelected));
		});

		return group;
	}

	private composeResourceList() {
		this.resourcesDropdownList = this.resources.map(resource => {
			return new DropdownItemMultiPickerModel({
				name: resource.description,
				value: { name: resource.resource },
				checked: false
			});
		});
	}
}
