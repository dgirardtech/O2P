/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import {
  DeSerializers,
  DefaultDeSerializers,
  DeserializedType,
  GetAllRequestBuilder,
  GetByKeyRequestBuilder,
  RequestBuilder
} from '@sap-cloud-sdk/odata-v2';
import { AfeDetailSet } from './AfeDetailSet';
/**
 * Request builder class for operations supported on the {@link AfeDetailSet} entity.
 */
export declare class AfeDetailSetRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<AfeDetailSet<T>, T> {
  /**
   * Returns a request builder for querying all `AfeDetailSet` entities.
   * @returns A request builder for creating requests to retrieve all `AfeDetailSet` entities.
   */
  getAll(): GetAllRequestBuilder<AfeDetailSet<T>, T>;
  /**
   * Returns a request builder for retrieving one `AfeDetailSet` entity based on its keys.
   * @param ivApprovalyear Key property. See {@link AfeDetailSet.ivApprovalyear}.
   * @param ivAufnr Key property. See {@link AfeDetailSet.ivAufnr}.
   * @param ivBukrs Key property. See {@link AfeDetailSet.ivBukrs}.
   * @returns A request builder for creating requests to retrieve one `AfeDetailSet` entity based on its keys.
   */
  getByKey(
    ivApprovalyear: DeserializedType<T, 'Edm.String'>,
    ivAufnr: DeserializedType<T, 'Edm.String'>,
    ivBukrs: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<AfeDetailSet<T>, T>;
}
