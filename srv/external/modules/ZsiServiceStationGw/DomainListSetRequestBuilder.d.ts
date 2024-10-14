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
import { DomainListSet } from './DomainListSet';
/**
 * Request builder class for operations supported on the {@link DomainListSet} entity.
 */
export declare class DomainListSetRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<DomainListSet<T>, T> {
  /**
   * Returns a request builder for querying all `DomainListSet` entities.
   * @returns A request builder for creating requests to retrieve all `DomainListSet` entities.
   */
  getAll(): GetAllRequestBuilder<DomainListSet<T>, T>;
  /**
   * Returns a request builder for retrieving one `DomainListSet` entity based on its keys.
   * @param domainName Key property. See {@link DomainListSet.domainName}.
   * @param spras Key property. See {@link DomainListSet.spras}.
   * @returns A request builder for creating requests to retrieve one `DomainListSet` entity based on its keys.
   */
  getByKey(
    domainName: DeserializedType<T, 'Edm.String'>,
    spras: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<DomainListSet<T>, T>;
}
