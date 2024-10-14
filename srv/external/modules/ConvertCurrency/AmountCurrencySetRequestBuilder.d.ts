/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import {
  CreateRequestBuilder,
  DeSerializers,
  DefaultDeSerializers,
  DeserializedType,
  GetAllRequestBuilder,
  GetByKeyRequestBuilder,
  RequestBuilder
} from '@sap-cloud-sdk/odata-v2';
import { AmountCurrencySet } from './AmountCurrencySet';
/**
 * Request builder class for operations supported on the {@link AmountCurrencySet} entity.
 */
export declare class AmountCurrencySetRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<AmountCurrencySet<T>, T> {
  /**
   * Returns a request builder for querying all `AmountCurrencySet` entities.
   * @returns A request builder for creating requests to retrieve all `AmountCurrencySet` entities.
   */
  getAll(): GetAllRequestBuilder<AmountCurrencySet<T>, T>;
  /**
   * Returns a request builder for creating a `AmountCurrencySet` entity.
   * @param entity The entity to be created
   * @returns A request builder for creating requests that create an entity of type `AmountCurrencySet`.
   */
  create(
    entity: AmountCurrencySet<T>
  ): CreateRequestBuilder<AmountCurrencySet<T>, T>;
  /**
   * Returns a request builder for retrieving one `AmountCurrencySet` entity based on its keys.
   * @param date Key property. See {@link AmountCurrencySet.date}.
   * @param foreignCurrency Key property. See {@link AmountCurrencySet.foreignCurrency}.
   * @param localCurrency Key property. See {@link AmountCurrencySet.localCurrency}.
   * @returns A request builder for creating requests to retrieve one `AmountCurrencySet` entity based on its keys.
   */
  getByKey(
    date: DeserializedType<T, 'Edm.DateTime'>,
    foreignCurrency: DeserializedType<T, 'Edm.String'>,
    localCurrency: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<AmountCurrencySet<T>, T>;
}
