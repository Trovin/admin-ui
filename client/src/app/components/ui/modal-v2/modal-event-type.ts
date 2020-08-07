export enum ModalEventType {
	CONFIRM = 'CONFIRM',
	DECLINE = 'DECLINE',
	ESC = 'ESC',
	BACKDROPCLICK = 'BACKDROPCLICK'
}

export namespace ModalEventType {
	export const aliasProperties = {
		'confirm': ModalEventType.CONFIRM,
		'decline': ModalEventType.DECLINE,
		'esc': ModalEventType.ESC,
		'backdrop-click': ModalEventType.BACKDROPCLICK
	};

	export function getByAlias(processAlias: string): ModalEventType {
		return aliasProperties[processAlias];
	}

	export function getAlias(eventType: ModalEventType): string {
		return Object.keys(aliasProperties).find(k => aliasProperties[k] === eventType);
	}
}