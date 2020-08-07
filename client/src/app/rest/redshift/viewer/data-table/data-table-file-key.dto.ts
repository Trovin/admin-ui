export class RedshiftDataTableFileKeyDto {
	key: string;

	constructor(data?: RedshiftDataTableFileKeyDto) {
		if(!data) {
			return;
		}

		this.key = data.key;
	}
}
