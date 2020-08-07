export interface IIndexPageInfo {
	title: string;
}

export interface IIndexUIPageInfo {
	pageInfo: IIndexPageInfo;
	setPageInfo(data: IIndexPageInfo): void;
}