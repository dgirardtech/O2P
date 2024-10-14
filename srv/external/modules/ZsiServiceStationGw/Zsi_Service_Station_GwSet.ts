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
export class Zsi_Service_Station_GwSet<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements Zsi_Service_Station_GwSetType<T>
{
  /**
   * Technical entity name for Zsi_Service_Station_GwSet.
   */
  static _entityName = 'ZSI_SERVICE_STATION_GWSet';
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath = '/sap/opu/odata/sap/ZSI_SERVICE_STATION_GW_SRV';
  /**
   * All key fields of the Zsi_Service_Station_GwSet entity
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
   * Loc Value.
   */
  declare locValue: DeserializedType<T, 'Edm.String'>;
  /**
   * Loc Descr.
   */
  declare locDescr: DeserializedType<T, 'Edm.String'>;
  /**
   * Area Q 8.
   */
  declare areaQ8: DeserializedType<T, 'Edm.String'>;
  /**
   * Area Q 8 Descr.
   */
  declare areaQ8Descr: DeserializedType<T, 'Edm.String'>;
  /**
   * Status.
   */
  declare status: DeserializedType<T, 'Edm.String'>;
  /**
   * Status Descr.
   */
  declare statusDescr: DeserializedType<T, 'Edm.String'>;
  /**
   * Sales District.
   */
  declare salesDistrict: DeserializedType<T, 'Edm.String'>;
  /**
   * Easy Station.
   * Maximum length: 5.
   */
  declare easyStation: DeserializedType<T, 'Edm.String'>;
  /**
   * Highway Station.
   * Maximum length: 5.
   */
  declare highwayStation: DeserializedType<T, 'Edm.String'>;
  /**
   * Chain Code.
   */
  declare chainCode: DeserializedType<T, 'Edm.String'>;
  /**
   * Chain Code Descr.
   */
  declare chainCodeDescr: DeserializedType<T, 'Edm.String'>;
  /**
   * Differentiator.
   */
  declare differentiator: DeserializedType<T, 'Edm.String'>;
  /**
   * Differentiator Descr.
   */
  declare differentiatorDescr: DeserializedType<T, 'Edm.String'>;
  /**
   * Dna.
   */
  declare dna: DeserializedType<T, 'Edm.String'>;
  /**
   * Dna Descr.
   */
  declare dnaDescr: DeserializedType<T, 'Edm.String'>;
  /**
   * Volume.
   */
  declare volume: DeserializedType<T, 'Edm.String'>;
  /**
   * Unitof Mes.
   */
  declare unitofMes: DeserializedType<T, 'Edm.String'>;
  /**
   * One-to-many navigation property to the {@link Zsi_Servs_Contract_Gw_ItemSet} entity.
   */
  declare servStationToContractItem: Zsi_Servs_Contract_Gw_ItemSet<T>[];
  /**
   * One-to-one navigation property to the {@link Zsi_Servs_Address_GwSet} entity.
   */
  declare servStationToAddress?: Zsi_Servs_Address_GwSet<T> | null;
  /**
   * One-to-one navigation property to the {@link Zsi_Servs_Agent_GwSet} entity.
   */
  declare servStationToAgent?: Zsi_Servs_Agent_GwSet<T> | null;
  /**
   * One-to-one navigation property to the {@link Zsi_Servs_Dealer_GwSet} entity.
   */
  declare servStationToDealer?: Zsi_Servs_Dealer_GwSet<T> | null;

  constructor(_entityApi: Zsi_Service_Station_GwSetApi<T>) {
    super(_entityApi);
  }
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
