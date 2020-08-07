import { BatchDataBaseParamsModel } from './tabs/shared/params-base.model';


export class BatchDataParamsModel extends BatchDataBaseParamsModel {
	sort?: string;

	constructor(data?: BatchDataParamsModel) {
		super(data);
		if(!data) {
			return;
		}

		this.page = data.page;
		this.sort = data.sort;
	}
}
