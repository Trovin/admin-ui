export class AuditReplayDto {
	message: string;

	constructor(data?: AuditReplayDto) {
		if(!data) {
			return;
		}
		this.message = data.message;
	}
}
