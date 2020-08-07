export class ConfigStorageUpdateQueriesDto {
	key: string;
	rsTemplateKey: string;
	enableWarnLevelValidation?: boolean;

	constructor(data?: ConfigStorageUpdateQueriesDto) {
		if(!data) {
			return;
		}

		this.key = data.key;
		this.rsTemplateKey = data.rsTemplateKey;
		this.enableWarnLevelValidation = data.enableWarnLevelValidation;
	}
}
