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
import type { DomainListSetApi } from './DomainListSetApi';

/**
 * This class represents the entity "DomainListSet" of service "ZSI_SERVICE_STATION_GW_SRV".
 */
export class DomainListSet<T extends DeSerializers = DefaultDeSerializers>
  extends Entity
  implements DomainListSetType<T>
{
  /**
   * Technical entity name for DomainListSet.
   */
  static _entityName = 'DomainListSet';
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath = '/sap/opu/odata/sap/ZSI_SERVICE_STATION_GW_SRV';
  /**
   * All key fields of the DomainListSet entity
   */
  static _keys = ['DomainName', 'Spras'];
  /**
   * Domain Name.
   */
  declare domainName: DeserializedType<T, 'Edm.String'>;
  /**
   * Lingua.
   * Maximum length: 2.
   */
  declare spras: DeserializedType<T, 'Edm.String'>;
  /**
   * Domain Code.
   * @nullable
   */
  declare domainCode?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Domain Value.
   * @nullable
   */
  declare domainValue?: DeserializedType<T, 'Edm.String'> | null;

  constructor(_entityApi: DomainListSetApi<T>) {
    super(_entityApi);
  }
}

export interface DomainListSetType<
  T extends DeSerializers = DefaultDeSerializers
> {
  domainName: DeserializedType<T, 'Edm.String'>;
  spras: DeserializedType<T, 'Edm.String'>;
  domainCode?: DeserializedType<T, 'Edm.String'> | null;
  domainValue?: DeserializedType<T, 'Edm.String'> | null;
}
