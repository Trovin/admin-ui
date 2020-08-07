import { S3UploaderPathConfigDto } from './path-config.dto';

export class S3UploaderConfigDto {
	bucket: string;
	paths: S3UploaderPathConfigDto[];

	constructor(data?: S3UploaderConfigDto) {
		if(!data) {
			return;
		}

		this.bucket = data.bucket;
		this.paths = data.paths.map(e => new S3UploaderPathConfigDto(e));
	}
}
