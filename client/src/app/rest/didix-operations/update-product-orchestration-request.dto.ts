import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
export class DidixOperationsUpdateProductRequestDto {
	operation: ModalActionsEnum;
	productId: number;
	productDesc: string;
	contentTypeId: number;
	boxsetyn: number;
	discontinuedyn: number;
	prepaidyn: number;
	image: string;
	sortId: number;
	currencyId: string;
	countryId: string;
	contentTypeDesc: string;

	userId?: string;
	userEmail?: string;
	userName?: string;

	constructor(data?: DidixOperationsUpdateProductRequestDto) {
		if(!data) {
			return;
		}

		this.operation = data.operation;
		this.productId = data.productId;
		this.productDesc = data.productDesc;
		this.contentTypeId = data.contentTypeId;
		this.boxsetyn = data.boxsetyn;
		this.discontinuedyn = data.discontinuedyn;
		this.prepaidyn = data.prepaidyn;
		this.image = data.image;
		this.sortId = data.sortId;
		this.currencyId = data.currencyId;
		this.countryId = data.countryId;
		this.contentTypeDesc = data.contentTypeDesc;

		this.userId = data.userId;
		this.userEmail = data.userEmail;
		this.userName = data.userName;
	}
}
