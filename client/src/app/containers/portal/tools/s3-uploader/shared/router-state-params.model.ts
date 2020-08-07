import { RouterStateParamsModel } from '@containers/shared/router-state.params.service';

export class S3UploaderRouterStateParamsModel extends RouterStateParamsModel {
	sort?: string;
	bucket?: string;
	path?: string;
	search?: string;

	constructor(data?: S3UploaderRouterStateParamsModel) {
		super(data);

		if(!data) {
			return;
		}

		this.sort = data.sort;
		this.bucket = data.bucket;
		this.path = data.path;
		this.search = data.search;
	}
}
