export class DidixOperationsLuChannelResponseDto {
	channel: string;
	channelLogo: string;
	code2: string;
	code3: string;

	constructor(data?: DidixOperationsLuChannelResponseDto) {
		if(!data) {
			return;
		}

		this.channel = data.channel;
		this.channelLogo = data.channelLogo;
		this.code2 = data.code2;
		this.code3 = data.code3;
	}
}
