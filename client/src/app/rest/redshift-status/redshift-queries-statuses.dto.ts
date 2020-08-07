export class RedshiftQueryStatusDto {
	userName: string;
	dbName: string;
	pid: number;
	query: string;
	startTime: Date;
	duration: string;

	constructor(data: RedshiftQueryStatusDto) {
		if(!data) {
			return;
		}

		this.userName = data.userName;
		this.dbName = data.dbName;
		this.pid = data.pid;
		this.query = data.query;
		this.startTime = data.startTime;
		this.duration = data.duration;
	}
}
