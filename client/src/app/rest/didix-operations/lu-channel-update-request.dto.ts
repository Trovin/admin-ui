import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
export class DidixOperationsLuChannelUpdateRequestDto {
	operation: ModalActionsEnum;
	channel: string;
	channelLogo: string;
	code2: string;
	code3: string;

	userId?: string;
	userEmail?: string;
	userName?: string;

	constructor(data?: DidixOperationsLuChannelUpdateRequestDto) {
		if(!data) {
			return;
		}

		this.operation = data.operation;
		this.channel = data.channel;
		this.channelLogo = data.channelLogo;
		this.code2 = data.code2;
		this.code3 = data.code3;

		this.userId = data.userId;
		this.userEmail = data.userEmail;
		this.userName = data.userName;
	}
}
