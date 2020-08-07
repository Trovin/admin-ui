import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { NotMappedFieldsCommentQueriesDto, NotMappedFieldsService } from '@rest/not-mapped-fields';

@Component({
	selector: 'not-mapped-fields-comment',
	templateUrl: './comment.html',
	providers: [NotMappedFieldsService]
})

export class NotMappedFieldsCommentComponent implements OnInit, OnChanges {
	@Input() id: number;
	@Input() message: string;

	private storedMessage = '';

	form = new FormGroup({
		message: new FormControl(this.message)
	});

	permission = PermissionAction;
	containers = Containers;

	isEdit = false;
	loading = false;

	constructor(private service: NotMappedFieldsService) {}

	ngOnInit() {
		this.storedMessage = this.message;
		this.patchForm(this.message);
	}

	ngOnChanges(changes: SimpleChanges) {
		if(changes.message && !changes.message.firstChange && changes.message.currentValue) {
			this.editToggle();
		}
	}

	editToggle() {
		this.isEdit = !this.isEdit;
	}

	cancelEdit() {
		this.patchForm(this.storedMessage);
		this.editToggle();
	}

	save() {
		if(this.isContentNotChanged()) {
			this.editToggle();
			return;
		}

		this.loading = true;
		const comment = this.form.get('message').value;
		const queries = new NotMappedFieldsCommentQueriesDto({
			comment: comment
		});

		this.service.addComment(this.id, queries)
			.subscribe(
				() => {
					this.editToggle();
					this.storedMessage = comment;
					this.loading = false;
				},
				() => this.loading = false
			);
	}

	private isContentNotChanged() {
		return this.form.get('message').value === this.storedMessage;
	}

	private patchForm(message: string) {
		const comment = {
			message
		};
		this.form.patchValue(comment);
	}
}
