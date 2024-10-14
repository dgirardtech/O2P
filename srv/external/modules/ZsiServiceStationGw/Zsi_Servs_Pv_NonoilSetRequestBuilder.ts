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
import { Zsi_Servs_Pv_NonoilSet } from './Zsi_Servs_Pv_NonoilSet';

/**
 * Request builder class for operations supported on the {@link Zsi_Servs_Pv_NonoilSet} entity.
 */
export class Zsi_Servs_Pv_NonoilSetRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<Zsi_Servs_Pv_NonoilSet<T>, T> {
  /**
   * Returns a request builder for querying all `Zsi_Servs_Pv_NonoilSet` entities.
   * @returns A request builder for creating requests to retrieve all `Zsi_Servs_Pv_NonoilSet` entities.
   */
  getAll(): GetAllRequestBuilder<Zsi_Servs_Pv_NonoilSet<T>, T> {
    return new GetAllRequestBuilder<Zsi_Servs_Pv_NonoilSet<T>, T>(
      this.entityApi
    );
  }

  /**
   * Returns a request builder for retrieving one `Zsi_Servs_Pv_NonoilSet` entity based on its keys.
   * @param servSid Key property. See {@link Zsi_Servs_Pv_NonoilSet.servSid}.
   * @param salesOrg Key property. See {@link Zsi_Servs_Pv_NonoilSet.salesOrg}.
   * @param distrCh Key property. See {@link Zsi_Servs_Pv_NonoilSet.distrCh}.
   * @param division Key property. See {@link Zsi_Servs_Pv_NonoilSet.division}.
   * @returns A request builder for creating requests to retrieve one `Zsi_Servs_Pv_NonoilSet` entity based on its keys.
   */
  getByKey(
    servSid: DeserializedType<T, 'Edm.String'>,
    salesOrg: DeserializedType<T, 'Edm.String'>,
    distrCh: DeserializedType<T, 'Edm.String'>,
    division: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<Zsi_Servs_Pv_NonoilSet<T>, T> {
    return new GetByKeyRequestBuilder<Zsi_Servs_Pv_NonoilSet<T>, T>(
      this.entityApi,
      {
        SERV_SID: servSid,
        SALES_ORG: salesOrg,
        DISTR_CH: distrCh,
        DIVISION: division
      }
    );
  }
}
