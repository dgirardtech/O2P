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
import { Zsi_Pid_Root_Pv_InfoSet } from './Zsi_Pid_Root_Pv_InfoSet';

/**
 * Request builder class for operations supported on the {@link Zsi_Pid_Root_Pv_InfoSet} entity.
 */
export class Zsi_Pid_Root_Pv_InfoSetRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<Zsi_Pid_Root_Pv_InfoSet<T>, T> {
  /**
   * Returns a request builder for querying all `Zsi_Pid_Root_Pv_InfoSet` entities.
   * @returns A request builder for creating requests to retrieve all `Zsi_Pid_Root_Pv_InfoSet` entities.
   */
  getAll(): GetAllRequestBuilder<Zsi_Pid_Root_Pv_InfoSet<T>, T> {
    return new GetAllRequestBuilder<Zsi_Pid_Root_Pv_InfoSet<T>, T>(
      this.entityApi
    );
  }

  /**
   * Returns a request builder for retrieving one `Zsi_Pid_Root_Pv_InfoSet` entity based on its keys.
   * @param servSid Key property. See {@link Zsi_Pid_Root_Pv_InfoSet.servSid}.
   * @param salesOrg Key property. See {@link Zsi_Pid_Root_Pv_InfoSet.salesOrg}.
   * @param distrCh Key property. See {@link Zsi_Pid_Root_Pv_InfoSet.distrCh}.
   * @param division Key property. See {@link Zsi_Pid_Root_Pv_InfoSet.division}.
   * @returns A request builder for creating requests to retrieve one `Zsi_Pid_Root_Pv_InfoSet` entity based on its keys.
   */
  getByKey(
    servSid: DeserializedType<T, 'Edm.String'>,
    salesOrg: DeserializedType<T, 'Edm.String'>,
    distrCh: DeserializedType<T, 'Edm.String'>,
    division: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<Zsi_Pid_Root_Pv_InfoSet<T>, T> {
    return new GetByKeyRequestBuilder<Zsi_Pid_Root_Pv_InfoSet<T>, T>(
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
