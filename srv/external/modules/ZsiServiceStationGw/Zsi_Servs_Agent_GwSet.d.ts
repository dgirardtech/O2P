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
import type { Zsi_Servs_Agent_GwSetApi } from './Zsi_Servs_Agent_GwSetApi';
/**
 * This class represents the entity "ZSI_SERVS_AGENT_GWSet" of service "ZSI_SERVICE_STATION_GW_SRV".
 */
export declare class Zsi_Servs_Agent_GwSet<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements Zsi_Servs_Agent_GwSetType<T>
{
  /**
   * Technical entity name for Zsi_Servs_Agent_GwSet.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the Zsi_Servs_Agent_GwSet entity
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
   * Agent Id.
   */
  agentId: DeserializedType<T, 'Edm.String'>;
  /**
   * Last Name.
   */
  lastName: DeserializedType<T, 'Edm.String'>;
  /**
   * First Name.
   */
  firstName: DeserializedType<T, 'Edm.String'>;
  /**
   * User Id.
   */
  userId: DeserializedType<T, 'Edm.String'>;
  /**
   * Code.
   */
  code: DeserializedType<T, 'Edm.String'>;
  constructor(_entityApi: Zsi_Servs_Agent_GwSetApi<T>);
}
export interface Zsi_Servs_Agent_GwSetType<
  T extends DeSerializers = DefaultDeSerializers
> {
  servSid: DeserializedType<T, 'Edm.String'>;
  salesOrg: DeserializedType<T, 'Edm.String'>;
  distrCh: DeserializedType<T, 'Edm.String'>;
  division: DeserializedType<T, 'Edm.String'>;
  agentId: DeserializedType<T, 'Edm.String'>;
  lastName: DeserializedType<T, 'Edm.String'>;
  firstName: DeserializedType<T, 'Edm.String'>;
  userId: DeserializedType<T, 'Edm.String'>;
  code: DeserializedType<T, 'Edm.String'>;
}
