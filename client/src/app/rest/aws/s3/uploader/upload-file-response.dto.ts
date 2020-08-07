import { S3ValidateFileDto } from './upload-file-validate.dto';

export class S3UploaderResponseDto {
	bucket: string;
	eTag: string;
	location: string;
	key: string;
	validate?: S3ValidateFileDto;


	constructor(data?: S3UploaderResponseDto) {
		if(!data) {
			return;
		}

		this.bucket = data.bucket;
		this.eTag = data.eTag;
		this.location = data.location;
		this.key = data.key;
		this.validate = data.validate;
	}
}
