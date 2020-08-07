import { ConfigStorageItemDto } from './config-storage-item.dto';

export class ConfigStorageSourceItemDto extends ConfigStorageItemDto {
	schemaName: string;
	tableName: string;

	constructor(data?: ConfigStorageSourceItemDto) {
		super(data);

		if(!data) {
			return;
		}

		this.schemaName = data.schemaName;
		this.tableName = data.tableName;
	}
}
