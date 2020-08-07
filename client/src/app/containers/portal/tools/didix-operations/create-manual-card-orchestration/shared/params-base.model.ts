import { RouterStateParamsModel } from '@containers/shared/router-state.params.service';

export class BaseParamsModel extends RouterStateParamsModel {
	article: string;
	productId: number;
	productDesc: string;
	debtor: string;
	salesDate: Date;
	salesPrice: number;
	salesAmountEuro: number;
	code: string;

	constructor(data?: BaseParamsModel) {
		super(data);

		if(!data) {
			return;
		}

		this.article = data.article;
		this.productDesc = data.productDesc;
		this.productId = data.productId;
		this.debtor = data.debtor;
		this.salesDate = data.salesDate;
		this.salesPrice = data.salesPrice;
		this.salesAmountEuro = data.salesAmountEuro;
		this.code = data.code;
	}
}

