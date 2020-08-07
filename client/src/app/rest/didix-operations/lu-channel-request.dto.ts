export class DidixOperationsLuChannelRequestDto {
	channel: string;

	constructor(data?: DidixOperationsLuChannelRequestDto) {
		if(!data) {
			return;
		}

		this.channel = data.channel;
	}
}
