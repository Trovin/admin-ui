export class DidixOperationsHistoryResponseDto {
	messageId: string;
	userEmail: string;
	userId: string;
	userName: string;
	groupName: string;
	project: string;
	version: string;
	environment: string;
	jobName: string;
	jsonRequest: string;
	status: string;
	errorMessage: string;
	createdDate: Date;
	updatedDate: Date;

	constructor(data?: DidixOperationsHistoryResponseDto) {
		if(!data) {
			return;
		}

		this.messageId = data.messageId;
		this.userEmail = data.userEmail;
		this.userId = data.userId;
		this.userName = data.userName;
		this.groupName = data.groupName;
		this.project = data.project;
		this.version = data.version;
		this.environment = data.environment;
		this.jobName = data.jobName;
		this.jsonRequest = data.jsonRequest;
		this.status = data.status;
		this.errorMessage = data.errorMessage;
		this.createdDate = data.createdDate;
		this.updatedDate = data.updatedDate;
	}
}
