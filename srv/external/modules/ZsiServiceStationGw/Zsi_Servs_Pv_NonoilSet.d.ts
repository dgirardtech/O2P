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
import type { Zsi_Servs_Pv_NonoilSetApi } from './Zsi_Servs_Pv_NonoilSetApi';
/**
 * This class represents the entity "ZSI_SERVS_PV_NONOILSet" of service "ZSI_SERVICE_STATION_GW_SRV".
 */
export declare class Zsi_Servs_Pv_NonoilSet<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements Zsi_Servs_Pv_NonoilSetType<T>
{
  /**
   * Technical entity name for Zsi_Servs_Pv_NonoilSet.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the Zsi_Servs_Pv_NonoilSet entity
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
   * Rental Unit.
   */
  rentalUnit: DeserializedType<T, 'Edm.String'>;
  /**
   * Lease Out Number.
   */
  leaseOutNumber: DeserializedType<T, 'Edm.String'>;
  /**
   * Data.
   */
  rentalStart: DeserializedType<T, 'Edm.DateTime'>;
  /**
   * Data.
   */
  rentalEnd: DeserializedType<T, 'Edm.DateTime'>;
  /**
   * Rent Amount.
   */
  rentAmount: DeserializedType<T, 'Edm.String'>;
  constructor(_entityApi: Zsi_Servs_Pv_NonoilSetApi<T>);
}
export interface Zsi_Servs_Pv_NonoilSetType<
  T extends DeSerializers = DefaultDeSerializers
> {
  servSid: DeserializedType<T, 'Edm.String'>;
  salesOrg: DeserializedType<T, 'Edm.String'>;
  distrCh: DeserializedType<T, 'Edm.String'>;
  division: DeserializedType<T, 'Edm.String'>;
  rentalUnit: DeserializedType<T, 'Edm.String'>;
  leaseOutNumber: DeserializedType<T, 'Edm.String'>;
  rentalStart: DeserializedType<T, 'Edm.DateTime'>;
  rentalEnd: DeserializedType<T, 'Edm.DateTime'>;
  rentAmount: DeserializedType<T, 'Edm.String'>;
}
