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
import type { Zsi_Service_Station_GwSetApi } from './Zsi_Service_Station_GwSetApi';
import {
  Zsi_Servs_Contract_Gw_ItemSet,
  Zsi_Servs_Contract_Gw_ItemSetType
} from './Zsi_Servs_Contract_Gw_ItemSet';
import {
  Zsi_Servs_Address_GwSet,
  Zsi_Servs_Address_GwSetType
} from './Zsi_Servs_Address_GwSet';
import {
  Zsi_Servs_Agent_GwSet,
  Zsi_Servs_Agent_GwSetType
} from './Zsi_Servs_Agent_GwSet';
import {
  Zsi_Servs_Dealer_GwSet,
  Zsi_Servs_Dealer_GwSetType
} from './Zsi_Servs_Dealer_GwSet';
/**
 * This class represents the entity "ZSI_SERVICE_STATION_GWSet" of service "ZSI_SERVICE_STATION_GW_SRV".
 */
export declare class Zsi_Service_Station_GwSet<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements Zsi_Service_Station_GwSetType<T>
{
  /**
   * Technical entity name for Zsi_Service_Station_GwSet.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the Zsi_Service_Station_GwSet entity
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
   * Loc Value.
   */
  locValue: DeserializedType<T, 'Edm.String'>;
  /**
   * Loc Descr.
   */
  locDescr: DeserializedType<T, 'Edm.String'>;
  /**
   * Area Q 8.
   */
  areaQ8: DeserializedType<T, 'Edm.String'>;
  /**
   * Area Q 8 Descr.
   */
  areaQ8Descr: DeserializedType<T, 'Edm.String'>;
  /**
   * Status.
   */
  status: DeserializedType<T, 'Edm.String'>;
  /**
   * Status Descr.
   */
  statusDescr: DeserializedType<T, 'Edm.String'>;
  /**
   * Sales District.
   */
  salesDistrict: DeserializedType<T, 'Edm.String'>;
  /**
   * Easy Station.
   * Maximum length: 5.
   */
  easyStation: DeserializedType<T, 'Edm.String'>;
  /**
   * Highway Station.
   * Maximum length: 5.
   */
  highwayStation: DeserializedType<T, 'Edm.String'>;
  /**
   * Chain Code.
   */
  chainCode: DeserializedType<T, 'Edm.String'>;
  /**
   * Chain Code Descr.
   */
  chainCodeDescr: DeserializedType<T, 'Edm.String'>;
  /**
   * Differentiator.
   */
  differentiator: DeserializedType<T, 'Edm.String'>;
  /**
   * Differentiator Descr.
   */
  differentiatorDescr: DeserializedType<T, 'Edm.String'>;
  /**
   * Dna.
   */
  dna: DeserializedType<T, 'Edm.String'>;
  /**
   * Dna Descr.
   */
  dnaDescr: DeserializedType<T, 'Edm.String'>;
  /**
   * Volume.
   */
  volume: DeserializedType<T, 'Edm.String'>;
  /**
   * Unitof Mes.
   */
  unitofMes: DeserializedType<T, 'Edm.String'>;
  /**
   * One-to-many navigation property to the {@link Zsi_Servs_Contract_Gw_ItemSet} entity.
   */
  servStationToContractItem: Zsi_Servs_Contract_Gw_ItemSet<T>[];
  /**
   * One-to-one navigation property to the {@link Zsi_Servs_Address_GwSet} entity.
   */
  servStationToAddress?: Zsi_Servs_Address_GwSet<T> | null;
  /**
   * One-to-one navigation property to the {@link Zsi_Servs_Agent_GwSet} entity.
   */
  servStationToAgent?: Zsi_Servs_Agent_GwSet<T> | null;
  /**
   * One-to-one navigation property to the {@link Zsi_Servs_Dealer_GwSet} entity.
   */
  servStationToDealer?: Zsi_Servs_Dealer_GwSet<T> | null;
  constructor(_entityApi: Zsi_Service_Station_GwSetApi<T>);
}
export interface Zsi_Service_Station_GwSetType<
  T extends DeSerializers = DefaultDeSerializers
> {
  servSid: DeserializedType<T, 'Edm.String'>;
  salesOrg: DeserializedType<T, 'Edm.String'>;
  distrCh: DeserializedType<T, 'Edm.String'>;
  division: DeserializedType<T, 'Edm.String'>;
  locValue: DeserializedType<T, 'Edm.String'>;
  locDescr: DeserializedType<T, 'Edm.String'>;
  areaQ8: DeserializedType<T, 'Edm.String'>;
  areaQ8Descr: DeserializedType<T, 'Edm.String'>;
  status: DeserializedType<T, 'Edm.String'>;
  statusDescr: DeserializedType<T, 'Edm.String'>;
  salesDistrict: DeserializedType<T, 'Edm.String'>;
  easyStation: DeserializedType<T, 'Edm.String'>;
  highwayStation: DeserializedType<T, 'Edm.String'>;
  chainCode: DeserializedType<T, 'Edm.String'>;
  chainCodeDescr: DeserializedType<T, 'Edm.String'>;
  differentiator: DeserializedType<T, 'Edm.String'>;
  differentiatorDescr: DeserializedType<T, 'Edm.String'>;
  dna: DeserializedType<T, 'Edm.String'>;
  dnaDescr: DeserializedType<T, 'Edm.String'>;
  volume: DeserializedType<T, 'Edm.String'>;
  unitofMes: DeserializedType<T, 'Edm.String'>;
  servStationToContractItem: Zsi_Servs_Contract_Gw_ItemSetType<T>[];
  servStationToAddress?: Zsi_Servs_Address_GwSetType<T> | null;
  servStationToAgent?: Zsi_Servs_Agent_GwSetType<T> | null;
  servStationToDealer?: Zsi_Servs_Dealer_GwSetType<T> | null;
}
