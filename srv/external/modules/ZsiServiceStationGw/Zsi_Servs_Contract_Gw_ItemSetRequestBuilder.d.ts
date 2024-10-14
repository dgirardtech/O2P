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
import { Zsi_Servs_Contract_Gw_ItemSet } from './Zsi_Servs_Contract_Gw_ItemSet';
/**
 * Request builder class for operations supported on the {@link Zsi_Servs_Contract_Gw_ItemSet} entity.
 */
export declare class Zsi_Servs_Contract_Gw_ItemSetRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<Zsi_Servs_Contract_Gw_ItemSet<T>, T> {
  /**
   * Returns a request builder for querying all `Zsi_Servs_Contract_Gw_ItemSet` entities.
   * @returns A request builder for creating requests to retrieve all `Zsi_Servs_Contract_Gw_ItemSet` entities.
   */
  getAll(): GetAllRequestBuilder<Zsi_Servs_Contract_Gw_ItemSet<T>, T>;
  /**
   * Returns a request builder for retrieving one `Zsi_Servs_Contract_Gw_ItemSet` entity based on its keys.
   * @param servSid Key property. See {@link Zsi_Servs_Contract_Gw_ItemSet.servSid}.
   * @param salesOrg Key property. See {@link Zsi_Servs_Contract_Gw_ItemSet.salesOrg}.
   * @param distrCh Key property. See {@link Zsi_Servs_Contract_Gw_ItemSet.distrCh}.
   * @param division Key property. See {@link Zsi_Servs_Contract_Gw_ItemSet.division}.
   * @returns A request builder for creating requests to retrieve one `Zsi_Servs_Contract_Gw_ItemSet` entity based on its keys.
   */
  getByKey(
    servSid: DeserializedType<T, 'Edm.String'>,
    salesOrg: DeserializedType<T, 'Edm.String'>,
    distrCh: DeserializedType<T, 'Edm.String'>,
    division: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<Zsi_Servs_Contract_Gw_ItemSet<T>, T>;
}
