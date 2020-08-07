import { SourceCatalogDto } from './source-catalog.dto';

export class SourceCatalogModel extends SourceCatalogDto {
	disabled: boolean;
	loading: boolean;
	inputFilesPageUrl: string;

	constructor(data?: SourceCatalogModel) {
		super(data);

		if(!data) {
			return;
		}

		this.disabled = data.disabled;
		this.loading = data.loading;
		this.inputFilesPageUrl = data.inputFilesPageUrl;
	}
}
