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
export declare class Zsi_Servs_Annual_VolumesSet<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements Zsi_Servs_Annual_VolumesSetType<T>
{
  /**
   * Technical entity name for Zsi_Servs_Annual_VolumesSet.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the Zsi_Servs_Annual_VolumesSet entity
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
   * Data.
   */
  fromDate: DeserializedType<T, 'Edm.DateTime'>;
  /**
   * Data.
   */
  toDate: DeserializedType<T, 'Edm.DateTime'>;
  /**
   * Gr. materiali.
   * Maximum length: 9.
   */
  matGroup: DeserializedType<T, 'Edm.String'>;
  /**
   * Material.
   */
  material: DeserializedType<T, 'Edm.String'>;
  /**
   * Mat Vol.
   */
  matVol: DeserializedType<T, 'Edm.String'>;
  /**
   * Collegamento.
   * Maximum length: 4.
   */
  matYear: DeserializedType<T, 'Edm.String'>;
  /**
   * C.Tx02.
   * Maximum length: 2.
   */
  matMonth: DeserializedType<T, 'Edm.String'>;
  constructor(_entityApi: Zsi_Servs_Annual_VolumesSetApi<T>);
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
