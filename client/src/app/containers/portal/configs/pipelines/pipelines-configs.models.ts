export class AutoConfigModel {
	objectKey?: string;
	lastModified?: Date;
	template?: string;
	process?: boolean;
	selected?: boolean;

	constructor(data?: AutoConfigModel) {
		if(!data) {
			return;
		}

		this.objectKey = data.objectKey;
		this.lastModified = data.lastModified;
		this.template = data.template;
		this.process = data.process;
		this.selected = data.selected;
	}
}

export class AutoConfigActionsListModel {
	selectedList: AutoConfigModel[] = [];
	downloadList: AutoConfigModel[] = [];
	executeList: AutoConfigModel[] = [];
	deleteList: AutoConfigModel[] = [];
	uploadList: File[] = [];

	constructor(data?: AutoConfigActionsListModel) {
		if(!data) {
			return;
		}

		this.selectedList = data.selectedList;
		this.downloadList = data.downloadList;
		this.executeList = data.executeList;
		this.deleteList = data.deleteList;
		this.uploadList = data.uploadList;
	}
}
