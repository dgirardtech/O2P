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
import { Zsi_Service_Station_GwSet } from './Zsi_Service_Station_GwSet';

/**
 * Request builder class for operations supported on the {@link Zsi_Service_Station_GwSet} entity.
 */
export class Zsi_Service_Station_GwSetRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<Zsi_Service_Station_GwSet<T>, T> {
  /**
   * Returns a request builder for querying all `Zsi_Service_Station_GwSet` entities.
   * @returns A request builder for creating requests to retrieve all `Zsi_Service_Station_GwSet` entities.
   */
  getAll(): GetAllRequestBuilder<Zsi_Service_Station_GwSet<T>, T> {
    return new GetAllRequestBuilder<Zsi_Service_Station_GwSet<T>, T>(
      this.entityApi
    );
  }

  /**
   * Returns a request builder for retrieving one `Zsi_Service_Station_GwSet` entity based on its keys.
   * @param servSid Key property. See {@link Zsi_Service_Station_GwSet.servSid}.
   * @param salesOrg Key property. See {@link Zsi_Service_Station_GwSet.salesOrg}.
   * @param distrCh Key property. See {@link Zsi_Service_Station_GwSet.distrCh}.
   * @param division Key property. See {@link Zsi_Service_Station_GwSet.division}.
   * @returns A request builder for creating requests to retrieve one `Zsi_Service_Station_GwSet` entity based on its keys.
   */
  getByKey(
    servSid: DeserializedType<T, 'Edm.String'>,
    salesOrg: DeserializedType<T, 'Edm.String'>,
    distrCh: DeserializedType<T, 'Edm.String'>,
    division: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<Zsi_Service_Station_GwSet<T>, T> {
    return new GetByKeyRequestBuilder<Zsi_Service_Station_GwSet<T>, T>(
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
