export class BaseResponseDto {
	status: number;
	message: string;

	constructor(data?: BaseResponseDto) {
		if(!data) {
			return;
		}

		this.status = data.status;
		this.message = data.message;
	}
}
