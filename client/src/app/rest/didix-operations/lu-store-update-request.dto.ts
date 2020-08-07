import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
export class DidixOperationsLuStoreUpdateRequestDto {
	operation: ModalActionsEnum;
	storeId: string;
	storeDesc: string;
	city: string;
	postalCode: string;
	countryId: string;
	b2b: string;
	channel: string;

	userId?: string;
	userEmail?: string;
	userName?: string;

	constructor(data?: DidixOperationsLuStoreUpdateRequestDto) {
		if(!data) {
			return;
		}

		this.operation = data.operation;
		this.storeId = data.storeId;
		this.storeDesc = data.storeDesc;
		this.city = data.city;
		this.postalCode = data.postalCode;
		this.countryId = data.countryId;
		this.b2b = data.b2b;
		this.channel = data.channel;

		this.userId = data.userId;
		this.userEmail = data.userEmail;
		this.userName = data.userName;
	}
}
