import { Component, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';

import { Subscription, Subject } from 'rxjs';
import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { UserService } from '@core/user/user.service';
import { S3UrIBuilderUtils } from '@utils/s3-url-builder.utils';
import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';

import {
	NotMappedFieldGroupDto,
	NotMappedFieldsService,
	NotMappedFieldsQueriesDto,
	NotMappedFieldsReviewStateQueriesDto
} from '@rest/not-mapped-fields';

import { SourceCatalogRouterStateParamsModel } from './shared/router-state-params.model';
import { SourceCatalogRouterStateParamsService } from './shared/router-state.params.service';
import { NotMappedFieldModel } from './shared/not-mapped-field.model';

type FilterByOptionsModel = {
	name: string;
	value: boolean;
	checked: boolean;
	highlighted: boolean;
};

@Component({
	selector: 'not-mapped-fields',
	templateUrl: './not-mapped-fields.html',
	styleUrls: ['./not-mapped-fields.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [
		SourceCatalogRouterStateParamsService,
		NotMappedFieldsService
	]
})

export class NotMappedFieldsComponent implements OnDestroy {
	private subscriptions: Subscription[] = [];
	private sub = new Subscription();
	private params = new NotMappedFieldsQueriesDto();

	permission = PermissionAction;
	containers = Containers;

	s3UrIBuilder = S3UrIBuilderUtils;
	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	items: NotMappedFieldGroupDto[] = [];
	amountItemsDisplayed = 20;
	loading = false;

	filterByOptions: DropdownItemPickerModel[] = [
		{name: 'Show All', value: null, checked: false, highlighted: false},
		{name: 'Reviewed', value: true, checked: false, highlighted: false},
		{name: 'Not Reviewed', value: false, checked: true, highlighted: false}
	];

	@ViewChild(DropdownItemPickerComponent, {static: true}) dropdownItemPickers: DropdownItemPickerComponent;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private routerStateParamsService: SourceCatalogRouterStateParamsService,
		private service: NotMappedFieldsService,
		private userService: UserService
	) {
		const sub = this.routerStateParamsService
			.getParamsSubj()
			.subscribe((params) => {
				this.composeParams(params);
				this.configUrlSubj().subscribe(() => this.fetch());
			});
		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(s => s.unsubscribe());
		this.sub.unsubscribe();
	}

	fetch() {
		this.loading = true;

		this.service.getList(this.params)
			.subscribe(
				resp => {
					this.items = resp;
					this.loading = false;
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);
	}

	showAll(event: HTMLButtonElement, input: HTMLInputElement, maxItems: number) {
		event.classList.add('load');
		setInterval(() => input.value = `${maxItems}`, 100);
	}

	changedFilterByOption(option: FilterByOptionsModel) {
		this.params.reviewed = option.value;
		this.routerStateParamsService.setParamsSubj(this.params);
	}

	toggleReview(active: boolean, item: NotMappedFieldModel) {
		item.reviewLoading = true;

		const sub = this.userService.getUserInfoSubj()
			.subscribe((userInfo) => {
				const queries = new NotMappedFieldsReviewStateQueriesDto({
					state: active,
					reviewer: !item.reviewed ? userInfo.email : null
				});


				this.service.toggleReview(item.id, queries)
					.subscribe(
						() => {
							item.reviewer = queries.reviewer;
							item.reviewed = queries.state;
							item.reviewLoading = false;
							this.updateItemCounts(item.sourceApplication, queries.state);
						},
						() => {
							item.reviewed = !queries.state;
							item.reviewLoading = false;
						}
					);
			});

		this.subscriptions.push(sub);
	}

	private composeParams(params: SourceCatalogRouterStateParamsModel) {
		this.params.reviewed = params.reviewed;
		this.filterByOptions.forEach((e) => { e.checked = e.value === params.reviewed; });
	}

	private updateItemCounts(source: string, state: boolean) {
		const targetItem = this.items.find(item => item.sourceApplication === source);
		state ? targetItem.reviewedCount++ : targetItem.reviewedCount--;
	}

	private configUrlSubj() {
		const subj = new Subject<never>();

		const queryParams: NavigationExtras = {
			queryParams: {
				'reviewed': this.params.reviewed
			},
			queryParamsHandling: 'merge',
			relativeTo: this.route,
			replaceUrl: true
		};

		this.router.navigate(['.'], queryParams)
			.then(() => {
				subj.next();
				subj.complete();
			});

		return subj;
	}
}
