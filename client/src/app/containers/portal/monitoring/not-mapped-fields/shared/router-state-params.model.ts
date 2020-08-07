import { RouterStateParamsModel } from '@containers/shared/router-state.params.service';

export class SourceCatalogRouterStateParamsModel extends RouterStateParamsModel {
	reviewed?: boolean;

	constructor(data: SourceCatalogRouterStateParamsModel) {
		super(data);

		if(!data) {
			return;
		}


		this.reviewed = data.reviewed;
	}
}
