export class RedshiftStatusDto {
	owner: string;
	db: string;
	xid: number;
	pid: number;
	startTime: Date;
	lockMode: string;
	tableId: number;
	tableName: string;
	granted: boolean;
	blockingPid: string;
	duration: string;

	constructor(data: RedshiftStatusDto) {
		if(!data) {
			return;
		}

		this.owner = data.owner;
		this.db = data.db;
		this.xid = data.xid;
		this.pid = data.pid;
		this.startTime = data.startTime;
		this.lockMode = data.lockMode;
		this.tableId = data.tableId;
		this.tableName = data.tableName;
		this.granted = data.granted;
		this.blockingPid = data.blockingPid;
		this.duration = data.duration;
	}
}
