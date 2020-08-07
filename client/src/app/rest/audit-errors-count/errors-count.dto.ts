export class AuditErrorsCountDto {
	errorsCount: number;

	constructor(data?: AuditErrorsCountDto) {
		if(!data) {
			return;
		}
		this.errorsCount = data.errorsCount;
	}
}
