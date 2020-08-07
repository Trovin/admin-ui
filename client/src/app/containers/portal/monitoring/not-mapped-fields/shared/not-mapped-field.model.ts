import { NotMappedFieldDto } from '@rest/not-mapped-fields/not-mapped-field.dto';

export class NotMappedFieldModel extends NotMappedFieldDto {
	reviewLoading: boolean;

	constructor(data: NotMappedFieldModel) {
		super(data);

		if(!data) {
			return;
		}

		this.reviewLoading = data.reviewLoading;
	}
}
