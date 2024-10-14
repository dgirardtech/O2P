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
import type { Zsi_Servs_Annual_VolumesSetApi } from './Zsi_Servs_Annual_VolumesSetApi';

/**
 * This class represents the entity "ZSI_SERVS_ANNUAL_VOLUMESSet" of service "ZSI_SERVICE_STATION_GW_SRV".
 */
export class Zsi_Servs_Annual_VolumesSet<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements Zsi_Servs_Annual_VolumesSetType<T>
{
  /**
   * Technical entity name for Zsi_Servs_Annual_VolumesSet.
   */
  static _entityName = 'ZSI_SERVS_ANNUAL_VOLUMESSet';
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath = '/sap/opu/odata/sap/ZSI_SERVICE_STATION_GW_SRV';
  /**
   * All key fields of the Zsi_Servs_Annual_VolumesSet entity
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
   * Data.
   */
  declare fromDate: DeserializedType<T, 'Edm.DateTime'>;
  /**
   * Data.
   */
  declare toDate: DeserializedType<T, 'Edm.DateTime'>;
  /**
   * Gr. materiali.
   * Maximum length: 9.
   */
  declare matGroup: DeserializedType<T, 'Edm.String'>;
  /**
   * Material.
   */
  declare material: DeserializedType<T, 'Edm.String'>;
  /**
   * Mat Vol.
   */
  declare matVol: DeserializedType<T, 'Edm.String'>;
  /**
   * Collegamento.
   * Maximum length: 4.
   */
  declare matYear: DeserializedType<T, 'Edm.String'>;
  /**
   * C.Tx02.
   * Maximum length: 2.
   */
  declare matMonth: DeserializedType<T, 'Edm.String'>;

  constructor(_entityApi: Zsi_Servs_Annual_VolumesSetApi<T>) {
    super(_entityApi);
  }
}

export interface Zsi_Servs_Annual_VolumesSetType<
  T extends DeSerializers = DefaultDeSerializers
> {
  servSid: DeserializedType<T, 'Edm.String'>;
  salesOrg: DeserializedType<T, 'Edm.String'>;
  distrCh: DeserializedType<T, 'Edm.String'>;
  division: DeserializedType<T, 'Edm.String'>;
  fromDate: DeserializedType<T, 'Edm.DateTime'>;
  toDate: DeserializedType<T, 'Edm.DateTime'>;
  matGroup: DeserializedType<T, 'Edm.String'>;
  material: DeserializedType<T, 'Edm.String'>;
  matVol: DeserializedType<T, 'Edm.String'>;
  matYear: DeserializedType<T, 'Edm.String'>;
  matMonth: DeserializedType<T, 'Edm.String'>;
}
