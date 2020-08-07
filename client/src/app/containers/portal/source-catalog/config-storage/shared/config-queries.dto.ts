import { S3DownloadFileQueriesDto } from '@rest/config-storage/downloadFileQueries.dto';

export class ConfigResponseDto {
	csvQueries: S3DownloadFileQueriesDto;
	sqlQueries: S3DownloadFileQueriesDto;
	status: string;
	taskReport: string;

	constructor(data?: ConfigResponseDto) {
		if(data) {
			this.csvQueries = data.csvQueries;
			this.sqlQueries = data.sqlQueries;
			this.status = data.status;
			this.taskReport = data.taskReport;
		}
	}
}
