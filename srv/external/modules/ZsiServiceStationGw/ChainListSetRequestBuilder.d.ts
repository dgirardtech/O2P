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
import { ChainListSet } from './ChainListSet';
/**
 * Request builder class for operations supported on the {@link ChainListSet} entity.
 */
export declare class ChainListSetRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<ChainListSet<T>, T> {
  /**
   * Returns a request builder for querying all `ChainListSet` entities.
   * @returns A request builder for creating requests to retrieve all `ChainListSet` entities.
   */
  getAll(): GetAllRequestBuilder<ChainListSet<T>, T>;
  /**
   * Returns a request builder for retrieving one `ChainListSet` entity based on its keys.
   * @param chainCode Key property. See {@link ChainListSet.chainCode}.
   * @returns A request builder for creating requests to retrieve one `ChainListSet` entity based on its keys.
   */
  getByKey(
    chainCode: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<ChainListSet<T>, T>;
}
