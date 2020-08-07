import { Component } from '@angular/core';

import { PaginationService } from '@containers/shared/pagination.service';

import { RedshiftTablesDiffService } from '@rest/redshift-tables-diff';

@Component({
	selector: 'didix-operations',
	templateUrl: './didix-operations.html',
	providers: [
		PaginationService,
		RedshiftTablesDiffService
	]
})

export class DidixOperationsComponent {}

