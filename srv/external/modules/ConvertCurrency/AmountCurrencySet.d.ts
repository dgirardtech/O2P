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
import type { AmountCurrencySetApi } from './AmountCurrencySetApi';
/**
 * This class represents the entity "AmountCurrencySet" of service "ZFA_AFE_COMMON_SRV".
 */
export declare class AmountCurrencySet<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements AmountCurrencySetType<T>
{
  /**
   * Technical entity name for AmountCurrencySet.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the AmountCurrencySet entity
   */
  static _keys: string[];
  /**
   * Date.
   */
  date: DeserializedType<T, 'Edm.DateTime'>;
  /**
   * Currency.
   * Maximum length: 5.
   */
  foreignCurrency: DeserializedType<T, 'Edm.String'>;
  /**
   * Currency.
   * Maximum length: 5.
   */
  localCurrency: DeserializedType<T, 'Edm.String'>;
  /**
   * Amount.
   */
  foreignAmount: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Amount.
   * @nullable
   */
  localAmount?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * Exch. Rate Type.
   * Maximum length: 4.
   * @nullable
   */
  typeOfRate?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Date.
   * @nullable
   */
  dateExchangeRate?: DeserializedType<T, 'Edm.DateTime'> | null;
  constructor(_entityApi: AmountCurrencySetApi<T>);
}
export interface AmountCurrencySetType<
  T extends DeSerializers = DefaultDeSerializers
> {
  date: DeserializedType<T, 'Edm.DateTime'>;
  foreignCurrency: DeserializedType<T, 'Edm.String'>;
  localCurrency: DeserializedType<T, 'Edm.String'>;
  foreignAmount: DeserializedType<T, 'Edm.Decimal'>;
  localAmount?: DeserializedType<T, 'Edm.Decimal'> | null;
  typeOfRate?: DeserializedType<T, 'Edm.String'> | null;
  dateExchangeRate?: DeserializedType<T, 'Edm.DateTime'> | null;
}
