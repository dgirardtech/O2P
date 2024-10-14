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
import type { Zsi_Pid_Root_Pv_InfoSetApi } from './Zsi_Pid_Root_Pv_InfoSetApi';
import {
  Zsi_Servs_Annual_VolumesSet,
  Zsi_Servs_Annual_VolumesSetType
} from './Zsi_Servs_Annual_VolumesSet';
import {
  Zsi_Servs_Pv_NonoilSet,
  Zsi_Servs_Pv_NonoilSetType
} from './Zsi_Servs_Pv_NonoilSet';

/**
 * This class represents the entity "ZSI_PID_ROOT_PV_INFOSet" of service "ZSI_SERVICE_STATION_GW_SRV".
 */
export class Zsi_Pid_Root_Pv_InfoSet<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements Zsi_Pid_Root_Pv_InfoSetType<T>
{
  /**
   * Technical entity name for Zsi_Pid_Root_Pv_InfoSet.
   */
  static _entityName = 'ZSI_PID_ROOT_PV_INFOSet';
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath = '/sap/opu/odata/sap/ZSI_SERVICE_STATION_GW_SRV';
  /**
   * All key fields of the Zsi_Pid_Root_Pv_InfoSet entity
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
   * One-to-many navigation property to the {@link Zsi_Servs_Annual_VolumesSet} entity.
   */
  declare servPidToAnnualVolums: Zsi_Servs_Annual_VolumesSet<T>[];
  /**
   * One-to-many navigation property to the {@link Zsi_Servs_Pv_NonoilSet} entity.
   */
  declare servPidToPvNonOil: Zsi_Servs_Pv_NonoilSet<T>[];

  constructor(_entityApi: Zsi_Pid_Root_Pv_InfoSetApi<T>) {
    super(_entityApi);
  }
}

export interface Zsi_Pid_Root_Pv_InfoSetType<
  T extends DeSerializers = DefaultDeSerializers
> {
  servSid: DeserializedType<T, 'Edm.String'>;
  salesOrg: DeserializedType<T, 'Edm.String'>;
  distrCh: DeserializedType<T, 'Edm.String'>;
  division: DeserializedType<T, 'Edm.String'>;
  servPidToAnnualVolums: Zsi_Servs_Annual_VolumesSetType<T>[];
  servPidToPvNonOil: Zsi_Servs_Pv_NonoilSetType<T>[];
}
