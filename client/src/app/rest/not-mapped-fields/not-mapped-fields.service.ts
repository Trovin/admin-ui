import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { NotMappedFieldGroupDto } from './not-mapped-fields.dto';
import { NotMappedFieldsQueriesDto } from './not-mapped-fields.queries.dto';
import { NotMappedFieldsCommentQueriesDto } from './not-mapped-fields-comment.queries.dto';
import { NotMappedFieldsReviewStateQueriesDto } from './not-mapped-fields-review-state.queries.dto';

@Injectable()
export class NotMappedFieldsService {
	constructor(private http: HttpRestService) { }

	getList(queries: NotMappedFieldsQueriesDto) {
		return this.http.get<NotMappedFieldGroupDto[]>('/not-mapped-fields', queries)
			.pipe(
				map(resp => {
					return resp.map(e => new NotMappedFieldGroupDto(e));
				}
			)
		);
	}

	addComment(id: number, queries: NotMappedFieldsCommentQueriesDto) {
		return this.http.update(`/not-mapped-fields/${id}/comment`, queries);
	}

	toggleReview(id: number, queries: NotMappedFieldsReviewStateQueriesDto) {
		return this.http.update(`/not-mapped-fields/${id}/review-state`, queries);
	}
}
