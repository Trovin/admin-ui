import { Injectable } from '@angular/core';

interface LocalStorageData {
	[key: string]: any;
}

@Injectable()
export class LocalStorageService {
	setItem(key: string, data: string|LocalStorageData): void {
		if(!data) {
			return;
		}
		localStorage.setItem(key, JSON.stringify(data));
	}

	getItem(key: string) {
		return JSON.parse(localStorage.getItem(key));
	}

	removeItem(key: string) {
		return localStorage.removeItem(key);
	}

	clear() {
		return localStorage.clear();
	}
}
