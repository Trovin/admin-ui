export enum PendingDetailsType {
	PENDING = 'PENDING',
	PARTIALLY_PROCESSED = 'PARTIALLY_PROCESSED'
}

export namespace PendingDetailsType {
	export const propertiesUI = {
		'PENDING': 'Pending / In progress',
		'PARTIALLY_PROCESSED': 'Partially processed'
	};

	export function getAliasUI(type: PendingDetailsType): string {
		return propertiesUI[type];
	}
}