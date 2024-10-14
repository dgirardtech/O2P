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
export declare class ChainListSet<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements ChainListSetType<T>
{
  /**
   * Technical entity name for ChainListSet.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the ChainListSet entity
   */
  static _keys: string[];
  /**
   * Cd.sett.ind.
   * Maximum length: 10.
   */
  chainCode: DeserializedType<T, 'Edm.String'>;
  /**
   * Chain Desc.
   * @nullable
   */
  chainDesc?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Lingua.
   * Maximum length: 2.
   * @nullable
   */
  spras?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * One-to-many navigation property to the {@link Zsi_Service_Station_GwSet} entity.
   */
  chainToServiceStation: Zsi_Service_Station_GwSet<T>[];
  /**
   * One-to-many navigation property to the {@link Zsi_Servs_Address_GwSet} entity.
   */
  chainToAddress: Zsi_Servs_Address_GwSet<T>[];
  constructor(_entityApi: ChainListSetApi<T>);
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
