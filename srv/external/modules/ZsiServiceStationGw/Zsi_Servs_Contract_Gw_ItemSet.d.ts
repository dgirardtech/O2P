/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import {
  Entity,
  DefaultDeSerializers,
  DeSerializers,
  DeserializedType
} from '@sap-cloud-sdk/odata-v2';
import type { Zsi_Servs_Contract_Gw_ItemSetApi } from './Zsi_Servs_Contract_Gw_ItemSetApi';
/**
 * This class represents the entity "ZSI_SERVS_CONTRACT_GW_ITEMSet" of service "ZSI_SERVICE_STATION_GW_SRV".
 */
export declare class Zsi_Servs_Contract_Gw_ItemSet<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements Zsi_Servs_Contract_Gw_ItemSetType<T>
{
  /**
   * Technical entity name for Zsi_Servs_Contract_Gw_ItemSet.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the Zsi_Servs_Contract_Gw_ItemSet entity
   */
  static _keys: string[];
  /**
   * Serv Sid.
   * Maximum length: 10.
   */
  servSid: DeserializedType<T, 'Edm.String'>;
  /**
   * Sales Org.
   * Maximum length: 4.
   */
  salesOrg: DeserializedType<T, 'Edm.String'>;
  /**
   * Distr Ch.
   * Maximum length: 2.
   */
  distrCh: DeserializedType<T, 'Edm.String'>;
  /**
   * Division.
   * Maximum length: 2.
   */
  division: DeserializedType<T, 'Edm.String'>;
  /**
   * Contract Number.
   */
  contractNumber: DeserializedType<T, 'Edm.String'>;
  /**
   * Data.
   */
  contractStart: DeserializedType<T, 'Edm.DateTime'>;
  /**
   * Data.
   */
  contractEnd: DeserializedType<T, 'Edm.DateTime'>;
  /**
   * Validity Period.
   */
  validityPeriod: DeserializedType<T, 'Edm.String'>;
  /**
   * Validity Period Desc.
   */
  validityPeriodDesc: DeserializedType<T, 'Edm.String'>;
  constructor(_entityApi: Zsi_Servs_Contract_Gw_ItemSetApi<T>);
}
export interface Zsi_Servs_Contract_Gw_ItemSetType<
  T extends DeSerializers = DefaultDeSerializers
> {
  servSid: DeserializedType<T, 'Edm.String'>;
  salesOrg: DeserializedType<T, 'Edm.String'>;
  distrCh: DeserializedType<T, 'Edm.String'>;
  division: DeserializedType<T, 'Edm.String'>;
  contractNumber: DeserializedType<T, 'Edm.String'>;
  contractStart: DeserializedType<T, 'Edm.DateTime'>;
  contractEnd: DeserializedType<T, 'Edm.DateTime'>;
  validityPeriod: DeserializedType<T, 'Edm.String'>;
  validityPeriodDesc: DeserializedType<T, 'Edm.String'>;
}
