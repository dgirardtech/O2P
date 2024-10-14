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
import type { Zsi_Servs_Dealer_GwSetApi } from './Zsi_Servs_Dealer_GwSetApi';

/**
 * This class represents the entity "ZSI_SERVS_DEALER_GWSet" of service "ZSI_SERVICE_STATION_GW_SRV".
 */
export class Zsi_Servs_Dealer_GwSet<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements Zsi_Servs_Dealer_GwSetType<T>
{
  /**
   * Technical entity name for Zsi_Servs_Dealer_GwSet.
   */
  static _entityName = 'ZSI_SERVS_DEALER_GWSet';
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath = '/sap/opu/odata/sap/ZSI_SERVICE_STATION_GW_SRV';
  /**
   * All key fields of the Zsi_Servs_Dealer_GwSet entity
   */
  static _keys = ['SERV_SID', 'SALES_ORG', 'DISTR_CH', 'DIVISION'];
  /**
   * Serv Sid.
   * Maximum length: 10.
   */
  declare servSid: DeserializedType<T, 'Edm.String'>;
  /**
   * Sales Org.
   * Maximum length: 4.
   */
  declare salesOrg: DeserializedType<T, 'Edm.String'>;
  /**
   * Distr Ch.
   * Maximum length: 2.
   */
  declare distrCh: DeserializedType<T, 'Edm.String'>;
  /**
   * Division.
   * Maximum length: 2.
   */
  declare division: DeserializedType<T, 'Edm.String'>;
  /**
   * Code.
   */
  declare code: DeserializedType<T, 'Edm.String'>;
  /**
   * Name.
   */
  declare name: DeserializedType<T, 'Edm.String'>;
  /**
   * Address.
   */
  declare address: DeserializedType<T, 'Edm.String'>;
  /**
   * City.
   */
  declare city: DeserializedType<T, 'Edm.String'>;
  /**
   * Region.
   */
  declare region: DeserializedType<T, 'Edm.String'>;
  /**
   * Zip.
   */
  declare zip: DeserializedType<T, 'Edm.String'>;
  /**
   * Piva.
   */
  declare piva: DeserializedType<T, 'Edm.String'>;
  /**
   * Fcode.
   */
  declare fcode: DeserializedType<T, 'Edm.String'>;

  constructor(_entityApi: Zsi_Servs_Dealer_GwSetApi<T>) {
    super(_entityApi);
  }
}

export interface Zsi_Servs_Dealer_GwSetType<
  T extends DeSerializers = DefaultDeSerializers
> {
  servSid: DeserializedType<T, 'Edm.String'>;
  salesOrg: DeserializedType<T, 'Edm.String'>;
  distrCh: DeserializedType<T, 'Edm.String'>;
  division: DeserializedType<T, 'Edm.String'>;
  code: DeserializedType<T, 'Edm.String'>;
  name: DeserializedType<T, 'Edm.String'>;
  address: DeserializedType<T, 'Edm.String'>;
  city: DeserializedType<T, 'Edm.String'>;
  region: DeserializedType<T, 'Edm.String'>;
  zip: DeserializedType<T, 'Edm.String'>;
  piva: DeserializedType<T, 'Edm.String'>;
  fcode: DeserializedType<T, 'Edm.String'>;
}
