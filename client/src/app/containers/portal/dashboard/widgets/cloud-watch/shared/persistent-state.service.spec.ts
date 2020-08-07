import { TestBed } from '@angular/core/testing';

import { expect } from 'chai';

import { Subscription } from 'rxjs';

import { LocalStorageService } from '@core/localstorage/localstorage.service';

import { DateRangeType } from '@enums/date-range-type.enum';

import { CloudWatchPersistentStateService, CloudWatchPersistentStateParams } from './persistent-state.service';

export interface LocalStorageParamsMock {
	[key: string]: any;
}

class LocalStorageServiceMock {
	store = {};

	getItem(key: string) {
		return key in this.store ? this.store[key] : null;
	}

	setItem(key: string, value: string|LocalStorageParamsMock) {
		this.store[key] = value;
	}

	clear() {
		this.store = {};
	}
}

describe('CloudWatchPersistentStateService', () => {
	let service: CloudWatchPersistentStateService;
	let defaultParams: CloudWatchPersistentStateParams;
	let subj: Subscription;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				CloudWatchPersistentStateService,
				{ provide: LocalStorageService, useClass: LocalStorageServiceMock }
			]
		});

		service = TestBed.get(CloudWatchPersistentStateService);
		defaultParams = service.getDefaultParams();
		subj = new Subscription();

		service.localStorageService.clear();
	});

	describe('getParamsSubj', () => {
		it('should return default value when localStorage empty', (done) => {
			const sub = service.getParamsSubj().subscribe(
				(result) => {
					const params = service.getDefaultParams();
					expect(result).to.deep.equal(params);
					done();
				},
				() => done('error')
			);
			subj.add(sub);
		});

		it('should return default value and value from localStorage', (done) => {
			const data = {
				'id': {
					dateRange: DateRangeType.LAST_7DAYS,
					dateFrom: new Date().toDateString(),
					dateTo: new Date().toDateString(),
					period: 86400
				}
			};
			service.setParamsSubj('galaxy-DASHBOARD', data);

			const sub = service.getParamsSubj().subscribe(
				(result) => {
					expect(result).to.deep.equal({...defaultParams, ...data});
					done();
				},
				() => done('error')
			);
			subj.add(sub);
		});
	});

	describe('composeDefaultParams', () => {
		it('should return default value', () => {
			const defaultDates = DateRangeType.getDateRangeData(DateRangeType.LAST_30DAYS);

			expect(service.getDefaultParams()).to.deep.equal({
				default: defaultDates
			});
		});
	});

	describe('getParams', () => {
		it('should return value from localStorage', () => {
			const data = {
				'id': {
					dateRange: DateRangeType.LAST_7DAYS,
					dateFrom: new Date().toDateString(),
					dateTo: new Date().toDateString(),
					period: 86400
				}
			};

			service.setParams('galaxy-DASHBOARD', data);
			expect(service.getParams('galaxy-DASHBOARD')).to.deep.equal({...defaultParams, ...data});
		});

		it('should return default value', () => {
			expect(service.getParams('galaxy-DASHBOARD')).to.deep.equal({...defaultParams});
		});
	});

	describe('setParams', () => {
		it('should return default value and value from localStorage', () => {
			const data = {
				'id': {
					dateRange: DateRangeType.LAST_7DAYS,
					dateFrom: new Date().toDateString(),
					dateTo: new Date().toDateString(),
					period: 86400
				}
			};
			service.setParams('galaxy-DASHBOARD', data);
			expect(service.getParams('galaxy-DASHBOARD')).to.deep.equal({...defaultParams, ...data});
		});

		it('should return default value if galaxy-DASHBOARD empty', () => {
			const data = undefined;
			service.setParams('galaxy-DASHBOARD', data);
			expect(service.getParams('galaxy-DASHBOARD')).to.deep.equal({...defaultParams});
		});

		it('should return default value if galaxy-DASHBOARD has wrong object', () => {
			const data = {
				'id': undefined
			};
			service.setParams('galaxy-DASHBOARD', data);
			expect(service.getParams('galaxy-DASHBOARD')).to.deep.equal({...defaultParams});
		});
	});

	describe('getDefaultParams', () => {
		it('should return default value', () => {
			expect(service.getDefaultParams()).to.deep.equal({...defaultParams});
		});
	});
});