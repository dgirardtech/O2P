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
import type { ChainListSetApi } from './ChainListSetApi';
import {
  Zsi_Service_Station_GwSet,
  Zsi_Service_Station_GwSetType
} from './Zsi_Service_Station_GwSet';
import {
  Zsi_Servs_Address_GwSet,
  Zsi_Servs_Address_GwSetType
} from './Zsi_Servs_Address_GwSet';

/**
 * This class represents the entity "ChainListSet" of service "ZSI_SERVICE_STATION_GW_SRV".
 */
export class ChainListSet<T extends DeSerializers = DefaultDeSerializers>
  extends Entity
  implements ChainListSetType<T>
{
  /**
   * Technical entity name for ChainListSet.
   */
  static _entityName = 'ChainListSet';
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath = '/sap/opu/odata/sap/ZSI_SERVICE_STATION_GW_SRV';
  /**
   * All key fields of the ChainListSet entity
   */
  static _keys = ['ChainCode'];
  /**
   * Cd.sett.ind.
   * Maximum length: 10.
   */
  declare chainCode: DeserializedType<T, 'Edm.String'>;
  /**
   * Chain Desc.
   * @nullable
   */
  declare chainDesc?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Lingua.
   * Maximum length: 2.
   * @nullable
   */
  declare spras?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * One-to-many navigation property to the {@link Zsi_Service_Station_GwSet} entity.
   */
  declare chainToServiceStation: Zsi_Service_Station_GwSet<T>[];
  /**
   * One-to-many navigation property to the {@link Zsi_Servs_Address_GwSet} entity.
   */
  declare chainToAddress: Zsi_Servs_Address_GwSet<T>[];

  constructor(_entityApi: ChainListSetApi<T>) {
    super(_entityApi);
  }
}

export interface ChainListSetType<
  T extends DeSerializers = DefaultDeSerializers
> {
  chainCode: DeserializedType<T, 'Edm.String'>;
  chainDesc?: DeserializedType<T, 'Edm.String'> | null;
  spras?: DeserializedType<T, 'Edm.String'> | null;
  chainToServiceStation: Zsi_Service_Station_GwSetType<T>[];
  chainToAddress: Zsi_Servs_Address_GwSetType<T>[];
}
