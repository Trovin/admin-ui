import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { NotificationSubscriptionDto } from './notification-subscriptions.dto';
import { NotificationSubscriptionComponentDto } from './notification-subscription-component.dto';

import { NotificationSubscriptionActiveQueriesDto } from './notification-subscription-active.queries.dto';
import { NotificationSubscriptionCreateQueriesDto } from './notification-subscription-create.queries.dto';

@Injectable()
export class NotificationSubscriptionsService {
	constructor(private http: HttpRestService) { }

	getList() {
		const resource = '/subscriptions';
		return this.http.get<NotificationSubscriptionDto[]>(resource)
			.pipe(
				take(1)
			);
	}

	getComponents() {
		const resource = '/subscriptions/components';
		return this.http.get<NotificationSubscriptionComponentDto[]>(resource)
			.pipe(
				take(1)
			);
	}

	delete(uuid: string) {
		const resource = `/subscriptions/${uuid}`;
		return this.http.delete(resource)
			.pipe(
				take(1)
			);
	}

	create(queries: NotificationSubscriptionCreateQueriesDto) {
		const resource = '/subscriptions/';
		return this.http.create(resource, queries)
			.pipe(
				take(1)
			);
	}

	switchState(uuid: string, queries: NotificationSubscriptionActiveQueriesDto) {
		const resource = `/subscriptions/${uuid}`;
		return this.http.update(resource, queries)
			.pipe(
				take(1)
			);
	}
}
