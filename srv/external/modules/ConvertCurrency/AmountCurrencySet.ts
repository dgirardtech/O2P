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
export class AmountCurrencySet<T extends DeSerializers = DefaultDeSerializers>
  extends Entity
  implements AmountCurrencySetType<T>
{
  /**
   * Technical entity name for AmountCurrencySet.
   */
  static _entityName = 'AmountCurrencySet';
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath = '/sap/opu/odata/sap/ZFA_AFE_COMMON_SRV';
  /**
   * All key fields of the AmountCurrencySet entity
   */
  static _keys = ['Date', 'ForeignCurrency', 'LocalCurrency'];
  /**
   * Date.
   */
  declare date: DeserializedType<T, 'Edm.DateTime'>;
  /**
   * Currency.
   * Maximum length: 5.
   */
  declare foreignCurrency: DeserializedType<T, 'Edm.String'>;
  /**
   * Currency.
   * Maximum length: 5.
   */
  declare localCurrency: DeserializedType<T, 'Edm.String'>;
  /**
   * Amount.
   */
  declare foreignAmount: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Amount.
   * @nullable
   */
  declare localAmount?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * Exch. Rate Type.
   * Maximum length: 4.
   * @nullable
   */
  declare typeOfRate?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Date.
   * @nullable
   */
  declare dateExchangeRate?: DeserializedType<T, 'Edm.DateTime'> | null;

  constructor(_entityApi: AmountCurrencySetApi<T>) {
    super(_entityApi);
  }
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
