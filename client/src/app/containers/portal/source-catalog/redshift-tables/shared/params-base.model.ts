import { RouterStateParamsModel } from '@containers/shared/router-state.params.service';

export class BaseParamsModel extends RouterStateParamsModel {
	selected?: string[];

	constructor(data?: BaseParamsModel) {
		super(data);

		if(!data) {
			return;
		}

		this.selected = typeof data.selected === 'string' ? [data.selected] :  data.selected;
	}
}
