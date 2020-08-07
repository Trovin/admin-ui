export class AuditFileCountDto {
	errorsCount: number;
	successCount: number;

	constructor(data?: AuditFileCountDto) {
		if(!data) {
			return;
		}
		this.errorsCount = data.errorsCount;
		this.successCount = data.successCount;
	}
}
