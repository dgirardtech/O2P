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
export declare class DomainListSet<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements DomainListSetType<T>
{
  /**
   * Technical entity name for DomainListSet.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the DomainListSet entity
   */
  static _keys: string[];
  /**
   * Domain Name.
   */
  domainName: DeserializedType<T, 'Edm.String'>;
  /**
   * Lingua.
   * Maximum length: 2.
   */
  spras: DeserializedType<T, 'Edm.String'>;
  /**
   * Domain Code.
   * @nullable
   */
  domainCode?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Domain Value.
   * @nullable
   */
  domainValue?: DeserializedType<T, 'Edm.String'> | null;
  constructor(_entityApi: DomainListSetApi<T>);
}
export interface DomainListSetType<
  T extends DeSerializers = DefaultDeSerializers
> {
  domainName: DeserializedType<T, 'Edm.String'>;
  spras: DeserializedType<T, 'Edm.String'>;
  domainCode?: DeserializedType<T, 'Edm.String'> | null;
  domainValue?: DeserializedType<T, 'Edm.String'> | null;
}
