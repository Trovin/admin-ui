import { NotMappedFieldDto } from './not-mapped-field.dto';

type NotMappedEventIdType = {
	eventId: string
	fields: NotMappedFieldDto[]
};

export class NotMappedFieldGroupDto {
	sourceApplication: string;
	eventIds: NotMappedEventIdType[];
	reviewedCount: number;
	total: number;

	constructor(data: NotMappedFieldGroupDto) {
		if(!data) {
			return;
		}

		this.sourceApplication = data.sourceApplication;
		this.eventIds = data.eventIds;
		this.reviewedCount = data.reviewedCount;
		this.total = data.total;
	}
}
