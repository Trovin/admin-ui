import { QueryParamsType } from './../../shared/query-params.type';

export class AWSSendEmailQueriesDto {
	data: QueryParamsType[];
	notes: string;
	userEmail: string;
	userName: string;

	constructor(data?: AWSSendEmailQueriesDto) {
		if(!data) {
			return;
		}

		this.data = data.data;
		this.notes = data.notes;
		this.userEmail = data.userEmail;
		this.userName = data.userName;
	}
}
