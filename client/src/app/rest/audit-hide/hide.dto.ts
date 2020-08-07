export class AuditHideDto {
	message: string;

	constructor(data?: AuditHideDto) {
		if(!data) {
			return;
		}
		this.message = data.message;
	}
}
