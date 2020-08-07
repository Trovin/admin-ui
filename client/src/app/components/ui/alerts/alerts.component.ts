import { Component, ViewEncapsulation, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { alertsService } from './alerts.service';

import { AlertType } from '@enums/alert-type.enum';

import { AlertModel } from '@components/ui/alerts/alert.model';

type Timer = {
	timerId: number,
	index: number
};

@Component({
	selector: 'alerts',
	templateUrl: './alerts.html',
	styleUrls: ['./alerts.scss'],
	encapsulation: ViewEncapsulation.Emulated
})

export class AlertsComponent implements OnDestroy {
	@Output() loginSilentEmitted = new EventEmitter<void>();

	private sub: Subscription;
	private timers: Timer[] = [];

	alerts: AlertModel[] = [];

	alertType = AlertType;

	constructor(private router: Router) {
		this.router.events
			.pipe(
				filter((event: RouterEvent) => event instanceof NavigationEnd)
			)
			.subscribe(
				() => this.alerts.forEach(i => this.close(i.index)),
				err => console.log(err)
			);

		this.sub = alertsService.change
			.subscribe((data: AlertModel) => {
				if(this.alerts.some(e => e.type === AlertType.UNAUTHORIZED)) {
					return;
				}
				this.addMesssage(data);
			});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	loginSilent() {
		this.alerts.forEach(i => this.close(i.index));
		this.loginSilentEmitted.emit();
	}

	forceRefreshPage() {
		location.reload();
	}

	close(index: number) {
		const alertData = this.alerts.find(e => e.index === index);

		if(alertData && alertData.type === AlertType.SUCCESS) {
			this.clearTimer(index);
			this.timers = this.timers.filter(e => e.index !== index);
		}

		this.alerts = this.alerts.filter(e => e.index !== index);
	}

	private clearTimer(index: number) {
		const timer = this.timers.find(e => e.index === index);
		window.clearTimeout(timer.timerId);
	}

	private setTimer(index: number) {
		const timerId = window.setTimeout(
			() => {
				this.close(index);
			},
			10000
		);

		this.timers.push({ timerId, index });
	}

	private addMesssage(data: AlertModel) {
		const index = this.alerts.length;
		const alertData = new AlertModel({...data, index});

		if(alertData.type === AlertType.SUCCESS) {
			this.setTimer(index);
		}

		this.alerts.push(alertData);
	}
}
