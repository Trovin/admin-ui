import { RouterStateParamsModel } from '@containers/shared/router-state.params.service';

export class SourceCatalogRouterStateParamsModel extends RouterStateParamsModel {
	sort?: string[];
	sourceApplication?: string;
	itemsPerPage?: number;

	constructor(data: SourceCatalogRouterStateParamsModel) {
		super(data);

		if(!data) {
			return;
		}

		this.sort = typeof data.sort === 'string' ? [data.sort] :  data.sort;
		this.sourceApplication = data.sourceApplication;
		this.itemsPerPage = data.itemsPerPage;
	}
}
