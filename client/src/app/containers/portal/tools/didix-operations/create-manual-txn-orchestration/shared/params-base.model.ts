import { RouterStateParamsModel } from '@containers/shared/router-state.params.service';

export class BaseParamsModel extends RouterStateParamsModel {
	article: string;
	productId: number;
	redeemAmt: string;
	redeemDate: Date;
	creditor: number;

	constructor(data?: BaseParamsModel) {
		super(data);

		if (!data) {
			return;
		}

		this.article = data.article;
		this.productId = data.productId;
		this.redeemAmt = data.redeemAmt;
		this.redeemDate = data.redeemDate;
		this.creditor = data.creditor;
	}
}

