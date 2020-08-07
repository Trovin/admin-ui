import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';

import { filter } from 'rxjs/operators';

import { AuthService } from '@core/auth/auth.service';
import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';
import { PermissionsService } from '@core/permissions/permissions.service';

import { navmanifest, INavigation, INavigationChild } from '@config/nav';

import { environment } from '@environments/environment';

@Component({
	selector: 'portal-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	@Output() toggledSidebar = new EventEmitter<never>();
	@Input() open: boolean;

	sections: INavigation[] = [];
	host = environment.host;

	constructor(
		public router: Router,
		private service: PermissionsService,
		private authService: AuthService
	) {
		this.router.events
			.pipe(
				filter((event: RouterEvent) => event instanceof NavigationEnd)
			)
			.subscribe(() => this.configActiveSection());
	}

	ngOnInit() {
		this.authService
			.getPermission()
			.subscribe(
				() => {
					this.sections = this.filterSections(navmanifest);
					this.configActiveSection();
				},
				() => {
					this.sections = [];
				}
			);
	}

	toggleSidebar(isBackdrop?: boolean) {
		if(!this.open || isBackdrop) {
			this.toggledSidebar.emit();
		}
	}

	toggleMenuItems() {
		this.sections
			.filter(i => i.active || i.opened)
			.forEach(i => setTimeout(() => i.opened = this.open)); // setTimeout - CD hack);
	}

	collapse(section: INavigation, e?: Event) {
		if(!section.children.length) {
			return;
		}

		if(e) {
			const el = <Element>e.target;
			if(el.tagName === 'A') {
				return;
			}
		}

		section.opened = !section.opened;
		this.toggleSidebar();
	}

	private configActiveSection() {
		this.sections
			.filter(s => this.composeActiveSection(s))
			.forEach((i) => {
				if(!!i.children.length) {
					i.opened = true;
				}

				i.active = true;
			});
	}

	private filterSections(sections: INavigation[]): INavigation[] {
		return sections.map(section => {
			const children = section.children;
			if (children && children.length) {
				children.forEach(child => child.hide = !this.isAllowed(child.container));
			}

			if(section.children.some(child => !child.hide)) {
				section.hide = false;
			}

			if(section.container) {
				section.hide = !this.isAllowed(section.container);
			}

			return section;
		});
	}

	private composeActiveSection(section: INavigation|INavigationChild) {
		if(!!section.children && !!section.children.length) {
			section.children.forEach((s) => {
				this.composeActiveSection(s);
			});
		}

		if(typeof section.href === 'string') {
			return false;
		}

		const routeSection = section.href.join('/');
		const routeSeparator = '/';
		const urlTree = this.router.parseUrl(this.router.url);
		const currentRoute = urlTree.root.children['primary'].segments.map(it => it.path).join('/');
		const route = routeSeparator.concat(currentRoute);

		if(routeSection === route || !!~route.indexOf(routeSection.concat(routeSeparator))) {
			return section;
		}

		section.opened = false;
		section.active = false;

		return false;
	}

	private isAllowed(container: Containers) {
		return this.service.getPermit(container, [PermissionAction.VIEW]);
	}
}
