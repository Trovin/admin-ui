type S3ValidateDataType = {
	title: string
	column: string
	message: string
};

export class S3ValidateFileDto {
	status: string;
	data?: S3ValidateDataType[];

	constructor(data?: S3ValidateFileDto) {
		if(!data) {
			return;
		}
		this.status = data.status;
		this.data = data.data;
	}
}
