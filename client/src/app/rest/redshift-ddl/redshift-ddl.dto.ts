export class RedshiftDdlDto {
	id: number;
	userName: number;
	xid: number;
	pid: number;
	label: string;
	startTime: Date;
	endTime: Date;
	sequence: number;
	ddlText: string;
	validateErrors: boolean;
	validateDescription: string;
	createdDate: Date;
	updatedDate: Date;

	constructor(data: RedshiftDdlDto) {
		if(!data) {
			return;
		}

		this.id = data.id;
		this.userName = data.userName;
		this.xid = data.xid;
		this.pid = data.pid;
		this.label = data.label;
		this.startTime = data.startTime;
		this.endTime = data.endTime;
		this.sequence = data.sequence;
		this.validateErrors = data.validateErrors;
		this.validateDescription = data.validateDescription;
		this.createdDate = data.createdDate;
		this.updatedDate = data.updatedDate;
	}
}