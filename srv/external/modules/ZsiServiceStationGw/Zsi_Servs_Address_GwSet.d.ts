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
import type { Zsi_Servs_Address_GwSetApi } from './Zsi_Servs_Address_GwSetApi';
/**
 * This class represents the entity "ZSI_SERVS_ADDRESS_GWSet" of service "ZSI_SERVICE_STATION_GW_SRV".
 */
export declare class Zsi_Servs_Address_GwSet<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements Zsi_Servs_Address_GwSetType<T>
{
  /**
   * Technical entity name for Zsi_Servs_Address_GwSet.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the Zsi_Servs_Address_GwSet entity
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
   * Loc Name.
   */
  locName: DeserializedType<T, 'Edm.String'>;
  /**
   * Street.
   */
  street: DeserializedType<T, 'Edm.String'>;
  /**
   * Street Numb.
   */
  streetNumb: DeserializedType<T, 'Edm.String'>;
  /**
   * City.
   */
  city: DeserializedType<T, 'Edm.String'>;
  /**
   * Zip Code.
   */
  zipCode: DeserializedType<T, 'Edm.String'>;
  /**
   * Region.
   */
  region: DeserializedType<T, 'Edm.String'>;
  /**
   * Province.
   */
  province: DeserializedType<T, 'Edm.String'>;
  constructor(_entityApi: Zsi_Servs_Address_GwSetApi<T>);
}
export interface Zsi_Servs_Address_GwSetType<
  T extends DeSerializers = DefaultDeSerializers
> {
  servSid: DeserializedType<T, 'Edm.String'>;
  salesOrg: DeserializedType<T, 'Edm.String'>;
  distrCh: DeserializedType<T, 'Edm.String'>;
  division: DeserializedType<T, 'Edm.String'>;
  locName: DeserializedType<T, 'Edm.String'>;
  street: DeserializedType<T, 'Edm.String'>;
  streetNumb: DeserializedType<T, 'Edm.String'>;
  city: DeserializedType<T, 'Edm.String'>;
  zipCode: DeserializedType<T, 'Edm.String'>;
  region: DeserializedType<T, 'Edm.String'>;
  province: DeserializedType<T, 'Edm.String'>;
}
