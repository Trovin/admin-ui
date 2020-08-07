import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { PageDto } from '@rest/shared/page.dto';
import { DidixOperationsDebtorResponseDto } from '@rest/didix-operations/debtor-response.dto';
import { DidixOperationsArticleRequestDto } from '@rest/didix-operations/articles-request.dto';
import { DidixOperationsProductResponseDto } from '@rest/didix-operations/product-response.dto';
import { DidixOperationsArticleResponseDto } from '@rest/didix-operations/article-response.dto';
import { DidixOperationsLuStoreResponseDto } from '@rest/didix-operations/lu-store-response.dto';
import { DidixOperationsCreditorResponseDto } from '@rest/didix-operations/creditor-response.dto';
import { DidixOperationsLuChannelRequestDto } from '@rest/didix-operations/lu-channel-request.dto';
import { DidixOperationsLuProductResponseDto } from '@rest/didix-operations/lu-product-response.dto';
import { DidixOperationsLuChannelResponseDto } from '@rest/didix-operations/lu-channel-response.dto';
import { DidixOperationsFctProductPlanResponseDto } from '@rest/didix-operations/fct-product-plan-response.dto';
import { DidixOperationsFctProductPlanRequestDto } from '@rest/didix-operations/fct-product-plan-request.dto';
import { DidixOperationsActualSalesResponseDto } from '@rest/didix-operations/fct-actual-sales-response.dto';
import { DidixOperationsLuArticleResponseDto } from '@rest/didix-operations/lu-article-response.dto';
import { DidixOperationsLuArticlesRequestDto } from '@rest/didix-operations/lu-articles-request.dto';
import { DidixOperationsHistoryRequestDto } from '@rest/didix-operations/history-request.dto';
import { DidixOperationsHistoryResponseDto } from '@rest/didix-operations/history-response.dto';
import { DidixOperationsLuCardResponseDto } from '@rest/didix-operations/lu-card-response.dto';
import { DidixOperationsLuContentTypeResponseDto } from '@rest/didix-operations/lu-content-type-response.dto';
import { DidixOperationsLuCardRequestDto } from '@rest/didix-operations/lu-card-request.dto';
import { DidixOperationsLuTransactionRequestDto } from '@rest/didix-operations/lu-transaction-request.dto';
import { DidixOperationsLuTransactionResponseDto } from '@rest/didix-operations/lu-transaction-response.dto';

@Injectable()
export class DidixOperationsService {
	constructor(private http: HttpRestService) { }

	post<T>(operation: string, queries: T) {
		return this.http.create(`/didix-operations/${operation}`, queries)
			.pipe(
				take(1)
			);
	}

	getLuProducts() {
		return this.http.get<DidixOperationsLuProductResponseDto[]>('/didix-operations/lu-products')
			.pipe(
				take(1)
			);
	}

	getHistory(jobAlias: string, dto?: DidixOperationsHistoryRequestDto) {
		return this.http.get<PageDto<DidixOperationsHistoryResponseDto>>(`/didix-operations/${jobAlias}/history`, dto)
			.pipe(
				take(1)
			);
	}

	getArticles(requestDto: DidixOperationsArticleRequestDto) {
		return this.http.get<DidixOperationsArticleResponseDto[]>('/didix-operations/articles', requestDto)
			.pipe(
				take(1)
			);
	}

	getSalesYears() {
		return this.http.get<number[]>('/didix-operations/lu-sales-years')
			.pipe(
				take(1)
			);
	}

	getProducts(jobAlias: string) {
		return this.http.get<DidixOperationsProductResponseDto[]>(`/didix-operations/${jobAlias}/products`)
			.pipe(
				take(1)
			);
	}

	getFctProductsPlans(requestDto: DidixOperationsFctProductPlanRequestDto) {
		return this.http.get<DidixOperationsFctProductPlanResponseDto[]>('/didix-operations/fct-products-plans', requestDto)
			.pipe(
				take(1)
			);
	}

	getFctActualSales(requestDto: DidixOperationsFctProductPlanRequestDto) {
		return this.http.get<DidixOperationsActualSalesResponseDto[]>('/didix-operations/fct-actual-sales', requestDto)
			.pipe(
				take(1)
			);
	}

	getCreditor<T>() {
		return this.http.get<DidixOperationsCreditorResponseDto[]>('/didix-operations/creditors')
			.pipe(
				take(1)
			);
	}

	getDebtors<T>() {
		return this.http.get<DidixOperationsDebtorResponseDto[]>('/didix-operations/debtors')
			.pipe(
				take(1)
			);
	}

	getLuCards<T>(params: DidixOperationsLuCardRequestDto) {
		return this.http.get<PageDto<DidixOperationsLuCardResponseDto>>('/didix-operations/lu-cards', params)
			.pipe(
				take(1)
			);
	}

	getLuTransactions<T>(params: DidixOperationsLuTransactionRequestDto) {
		return this.http.get<PageDto<DidixOperationsLuTransactionResponseDto>>('/didix-operations/lu-transactions', params)
			.pipe(
				take(1)
			);
	}

	getMaintainChannels() {
		return this.http.get<DidixOperationsLuChannelResponseDto[]>('/didix-operations/lu-channels')
			.pipe(
				take(1)
			);
	}

	getLuStores(dto: DidixOperationsLuChannelRequestDto) {
		return this.http.get<DidixOperationsLuStoreResponseDto[]>('/didix-operations/lu-stores', dto)
			.pipe(
				take(1)
			);
	}

	getLuStoreChannels() {
		return this.http.get<string[]>('/didix-operations/lu-store-channels')
			.pipe(
				take(1)
			);
	}

	getLuContentTypes() {
		return this.http.get<DidixOperationsLuContentTypeResponseDto[]>('/didix-operations/lu-content-types')
			.pipe(
				take(1)
			);
	}

	getLuArticles(dto: DidixOperationsLuArticlesRequestDto) {
		return this.http.get<DidixOperationsLuArticleResponseDto[]>('/didix-operations/lu-articles', dto)
			.pipe(
				take(1)
			);
	}
}
